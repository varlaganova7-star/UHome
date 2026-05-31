import os
import json
import socketio
import asyncpg
import traceback
from datetime import datetime
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

# ================= КОНФИГУРАЦИЯ =================
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins='*',
    logger=False,
    engineio_logger=False,
    allow_upgrades=True,
    ping_timeout=60,
    ping_interval=25
)
socket_app = socketio.ASGIApp(sio)

app = FastAPI(title="UHome Chat API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/", socket_app)

# Хранилище подключений: {role: {name: [sid, ...]}}
connected_users: dict[str, dict[str, list]] = {}

# ================= БАЗА ДАННЫХ =================
@app.on_event("startup")
async def startup():
    try:
        dsn = os.getenv("DATABASE_URL")
        app.state.db_pool = await asyncpg.create_pool(
            dsn=dsn,
            ssl=False,
            min_size=2,
            max_size=10,
            command_timeout=30
        )
        print("✅ База данных подключена")
    except Exception as e:
        print(f"❌ Ошибка подключения к БД: {e}")
        traceback.print_exc()
        app.state.db_pool = None

@app.on_event("shutdown")
async def shutdown():
    if hasattr(app.state, "db_pool") and app.state.db_pool:
        await app.state.db_pool.close()
        print("🔌 Пул соединений закрыт")

# ================= SOCKET.IO: ПОДКЛЮЧЕНИЕ =================
@sio.on("connect")
async def on_connect(sid, environ):
    print(f"🔗 Подключён: {sid}")

@sio.on("disconnect")
async def on_disconnect(sid):
    for role in connected_users:
        for name in list(connected_users[role].keys()):
            if sid in connected_users[role][name]:
                connected_users[role][name].remove(sid)
                if not connected_users[role][name]:
                    del connected_users[role][name]
    print(f"🔌 Отключён: {sid}")

# ================= РЕГИСТРАЦИЯ ПОЛЬЗОВАТЕЛЯ =================
@sio.on("register_user")
async def on_register(sid, data):
    role = data.get("role", "guest")
    name = data.get("name", "Аноним")
    
    # Нормализация ролей
    if role in ["Администрация", "Administration"]:
        role = "admin"
    elif role in ["Мастер", "Electrick", "Plumber", "Carpenter", "Slesar", "Santex"]:
        role = "master"
    elif role not in ["admin", "student", "master"]:
        role = "student"
    
    # Добавляем в connected_users
    if role not in connected_users:
        connected_users[role] = {}
    if name not in connected_users[role]:
        connected_users[role][name] = []
    connected_users[role][name].append(sid)
    
    print(f"👤 Зарегистрирован: {name} ({role}) → {sid}")
    
    await sio.emit("user_registered", {
        "role": role,
        "name": name,
        "message": f"Вы вошли как {role}"
    }, room=sid)
    
    # Загружаем историю чата
    if role == "admin":
        user_list = await get_chat_users_for_admin()
        await sio.emit("chat_list", user_list, room=sid)
    else:
        history = await get_chat_history(name, "admin", limit=100)
        await sio.emit("chat_history", {
            "partner_name": "Администрация",
            "partner_role": "admin",
            "messages": history
        }, room=sid)

# ================= ОТПРАВКА СООБЩЕНИЯ =================
@sio.on("send_message")
async def on_send_message(sid, data):
    pool = getattr(app.state, "db_pool", None)
    if not pool:
        await sio.emit("error", {"text": "База данных недоступна"}, room=sid)
        return
    
    # Находим отправителя по sid
    sender = None
    for role, users in connected_users.items():
        for name, sids in users.items():
            if sid in sids:
                sender = {"role": role, "name": name}
                break
        if sender:
            break
    
    if not sender:
        await sio.emit("error", {"text": "Пользователь не зарегистрирован"}, room=sid)
        return
    
    text = data.get("text", "").strip()
    if not text:
        return
    
    recipient_role = data.get("recipient_role", "admin")
    recipient_name = data.get("recipient_name")
    
    # 🔐 Проверка прав: студенты и мастера пишут ТОЛЬКО админу
    if sender["role"] != "admin" and recipient_role != "admin":
        await sio.emit("error", {"text": "Разрешена переписка только с администрацией"}, room=sid)
        return
    
    # Сохраняем в БД
    try:
        await pool.execute(
            """INSERT INTO messages 
               (sender_role, sender_name, recipient_role, recipient_name, text, media)
               VALUES ($1, $2, $3, $4, $5, $6)""",
            sender["role"], sender["name"], recipient_role, recipient_name, text, json.dumps([])
        )
    except Exception as e:
        print(f"❌ Ошибка записи в БД: {e}")
        await sio.emit("error", {"text": "Не удалось отправить сообщение"}, room=sid)
        return
    
    # Формируем объект сообщения
    msg = {
        "id": None,
        "sender_role": sender["role"],
        "sender_name": sender["name"],
        "recipient_role": recipient_role,
        "recipient_name": recipient_name,
        "text": text,
        "media": [],
        "created_at": datetime.now().isoformat()
    }
    
    # 📤 Рассылка
    if sender["role"] == "admin":
        # Админ отправляет → доставляем конкретному пользователю
        if recipient_name and recipient_name in connected_users.get(data.get("recipient_role", "student"), {}):
            for target_sid in connected_users[recipient_role][recipient_name]:
                await sio.emit("new_message", msg, room=target_sid)
        await sio.emit("new_message", msg, room=sid)
    else:
        # Студент/мастер отправляет админу
        await sio.emit("new_message", msg, room=sid)  # Отправителю
        # Всем подключённым админам
        if "admin" in connected_users:
            for admin_name, admin_sids in connected_users["admin"].items():
                for admin_sid in admin_sids:
                    await sio.emit("new_message", msg, room=admin_sid)
    
    # 🔔 Уведомляем админа о новом чате
    if sender["role"] != "admin":
        await notify_admin_of_new_chat(sender["name"], sender["role"], text)

# ================= REST API: СПИСОК ПОЛЬЗОВАТЕЛЕЙ (для админа) =================
@app.get("/api/chat/users")
async def get_chat_users(x_user_role: str = Header(None, alias="X-User-Role")):
    if x_user_role != "admin":
        raise HTTPException(status_code=403, detail="Доступ только для администрации")
    return await get_chat_users_for_admin()

async def get_chat_users_for_admin():
    pool = getattr(app.state, "db_pool", None)
    if not pool:
        return []
    
    rows = await pool.fetch("""
        SELECT 
            sender_name as name,
            sender_role as role,
            COUNT(*) as message_count,
            MAX(created_at) as last_message_at,
            (SELECT text FROM messages m2 
             WHERE (m2.sender_name = messages.sender_name OR m2.recipient_name = messages.sender_name)
               AND m2.sender_role != 'admin'
             ORDER BY created_at DESC LIMIT 1) as last_message
        FROM messages
        WHERE sender_role != 'admin' OR recipient_role != 'admin'
        GROUP BY sender_name, sender_role
        ORDER BY last_message_at DESC
    """)
    
    users = []
    for r in rows:
        users.append({
            "name": r["name"],
            "role": r["role"],
            "message_count": r["message_count"],
            "last_message_at": r["last_message_at"].isoformat() if r["last_message_at"] else None,
            "last_message": r["last_message"] or "Нет сообщений"
        })
    return users

# ================= REST API: ИСТОРИЯ ЧАТА =================
@app.get("/api/chat/history")
async def get_history_api(
    partner_name: str,
    partner_role: str = "admin",
    limit: int = 100,
    x_user_role: str = Header(None, alias="X-User-Role"),
    x_user_name: str = Header(None, alias="X-User-Name")
):
    if x_user_role == "admin":
        pass  # Админ может смотреть любой чат
    elif x_user_name and partner_name == "Администрация" and partner_role == "admin":
        pass  # Студент/мастер может смотреть только свой чат с админом
    else:
        raise HTTPException(status_code=403, detail="Доступ запрещён")
    
    history = await get_chat_history(
        user_name=x_user_name or partner_name,
        partner_role=partner_role,
        limit=limit
    )
    return {"messages": history}

async def get_chat_history(user_name: str, partner_role: str, limit: int = 50):
    pool = getattr(app.state, "db_pool", None)
    if not pool:
        return []
    
    if partner_role == "admin":
        rows = await pool.fetch("""
            SELECT id, sender_role, sender_name, recipient_role, recipient_name, text, media, created_at
            FROM messages
            WHERE 
                (sender_name = $1 AND recipient_role = 'admin')
                OR (sender_role = 'admin' AND (recipient_name = $1 OR recipient_name IS NULL))
            ORDER BY created_at ASC
            LIMIT $2
        """, user_name, limit)
    else:
        rows = await pool.fetch("""
            SELECT id, sender_role, sender_name, recipient_role, recipient_name, text, media, created_at
            FROM messages
            WHERE 
                (sender_name = $1 AND recipient_role = $2)
                OR (sender_role = $2 AND recipient_name = $1)
            ORDER BY created_at ASC
            LIMIT $3
        """, user_name, partner_role, limit)
    
    history = []
    for r in rows:
        row_dict = dict(r)
        if row_dict.get("media"):
            try:
                row_dict["media"] = json.loads(row_dict["media"])
            except:
                row_dict["media"] = []
        history.append(row_dict)
    return history

# ================= УВЕДОМЛЕНИЕ АДМИНА О НОВОМ ЧАТЕ =================
async def notify_admin_of_new_chat(user_name: str, user_role: str, preview: str):
    if "admin" not in connected_users:
        return
    for admin_name, admin_sids in connected_users["admin"].items():
        for admin_sid in admin_sids:
            await sio.emit("new_chat_notification", {
                "user_name": user_name,
                "user_role": user_role,
                "preview": preview[:100] + ("..." if len(preview) > 100 else ""),
                "timestamp": datetime.now().isoformat()
            }, room=admin_sid)

# ================= ЗАПУСК =================
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 3000))
    uvicorn.run("chat:app", host="0.0.0.0", port=port, reload=True)