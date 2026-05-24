import os
import json
import socketio
import asyncpg
import traceback
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv


load_dotenv()

# ================= КОНФИГУРАЦИЯ =================
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins="*",
    logger=False,          # Включите True только для отладки
    engineio_logger=False
)
socket_app = socketio.ASGIApp(sio)

app = FastAPI(title="UHome Chat Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/", socket_app)

# Хранилище онлайн-пользователей: {role: [{'sid': sid, 'name': name}]}
connected_users: dict[str, list] = {}

# ================= ЖИЗНЕННЫЙ ЦИКЛ =================
@app.on_event("startup")
async def startup():
    try:
        dsn = os.getenv("DATABASE_URL")
        app.state.db_pool = await asyncpg.create_pool(
            dsn=dsn,
            ssl=False,               # ← ✅ КРИТИЧНО для локальной БД на Windows
            min_size=1,
            max_size=5,
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

# ================= SOCKET.IO СОБЫТИЯ =================
@sio.on("connect")
async def on_connect(sid, environ):
    print(f"🔗 Клиент подключился: {sid}")

@sio.on("register_user")
async def on_register(sid, data):
    role = data.get("role", "guest")
    name = data.get("name", "Пользователь")
    
    if role not in connected_users:
        connected_users[role] = []
    connected_users[role].append({"sid": sid, "name": name})
    print(f"👤 Зарегистрирован: {name} ({role})")
    
    await sio.emit("system_message", {"text": f"Вы вошли как {role}"}, room=sid)
    await sio.emit("history", await get_history_for_role(role, limit=50), room=sid)

@sio.on("send_message")
async def on_send_message(sid, data):
    pool = getattr(app.state, "db_pool", None)
    if not pool:
        await sio.emit("error", {"text": "База данных недоступна"}, room=sid)
        return

    # Поиск отправителя
    sender = None
    for role, users in connected_users.items():
        for u in users:
            if u["sid"] == sid:
                sender = {"role": role, "name": u["name"]}
                break
        if sender: break

    if not sender:
        return

    text = data.get("text", "").strip()
    recipient = data.get("recipient", "admin")
    media = data.get("media", [])

    # Проверка прав: не-админ может писать только админу
    if sender["role"] != "admin" and recipient != "admin":
        await sio.emit("error", {"text": "Студенты и мастера пишут только администрации!"}, room=sid)
        return

    # Сохранение в БД
    try:
        await pool.execute(
            """INSERT INTO messages (sender_role, sender_name, recipient_role, text, media)
               VALUES ($1, $2, $3, $4, $5)""",
            sender["role"], sender["name"], recipient, text, json.dumps(media)
        )
    except Exception as e:
        print(f"❌ Ошибка записи в БД: {e}")
        await sio.emit("error", {"text": "Не удалось сохранить сообщение"}, room=sid)
        return

    # Формируем объект сообщения
    msg_obj = {
        "sender_role": sender["role"],
        "sender_name": sender["name"],
        "recipient_role": recipient,
        "text": text,
        "media": media,
        "created_at": str(__import__("datetime").datetime.now())
    }

    # Рассылка
    await sio.emit("new_message", msg_obj, room=sid)  # Отправителю
    await broadcast_to_role(recipient, "new_message", msg_obj, exclude_sid=sid)

@sio.on("disconnect")
async def on_disconnect(sid):
    for role in connected_users:
        connected_users[role] = [u for u in connected_users[role] if u["sid"] != sid]
    print(f"🔌 Отключился: {sid}")
# ================= НОВЫЙ ЭНДПОИНТ: список студентов для админа =================
@app.get("/api/admin/students")
async def get_students_for_admin():
    """Возвращает список уникальных студентов, которые писали администрации"""
    pool = getattr(app.state, "db_pool", None)
    if not pool:
        return {"error": "База данных недоступна"}
    
    # Запрос: уникальные студенты + последнее сообщение + количество
    rows = await pool.fetch("""
        SELECT 
            sender_name,
            sender_role,
            COUNT(*) as message_count,
            MAX(created_at) as last_message_at,
            (SELECT text FROM messages m2 
             WHERE m2.sender_role = messages.sender_role 
             AND m2.sender_name = messages.sender_name 
             ORDER BY created_at DESC LIMIT 1) as last_message_text
        FROM messages
        WHERE recipient_role = 'admin' 
          AND sender_role != 'admin'
        GROUP BY sender_name, sender_role
        ORDER BY last_message_at DESC
    """)
    
    students = []
    for r in rows:
        students.append({
            "name": r["sender_name"],
            "role": r["sender_role"],
            "message_count": r["message_count"],
            "last_message_at": r["last_message_at"].isoformat() if r["last_message_at"] else None,
            "last_message_text": r["last_message_text"]
        })
    
    return {"students": students, "total": len(students)}
from fastapi import Header, HTTPException

@app.get("/api/admin/students")
async def get_students_for_admin(
    x_user_role: str = Header(None, alias="X-User-Role")
):
    # 🔐 Проверка: только admin или studsovet
    if x_user_role not in ["admin", "studsovet"]:
        raise HTTPException(status_code=403, detail="❌ Доступ запрещён")
    
    # ... остальной код из Шага 1 ...

# ================= ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =================
async def get_history_for_role(role: str, limit: int = 50):
    pool = getattr(app.state, "db_pool", None)
    if not pool: return []

    if role == "admin":
        rows = await pool.fetch("SELECT * FROM messages ORDER BY created_at DESC LIMIT $1", limit)
    else:
        rows = await pool.fetch(
            """SELECT * FROM messages 
               WHERE (sender_role = $1 AND recipient_role = 'admin') 
                  OR (sender_role = 'admin' AND recipient_role = $1)
               ORDER BY created_at DESC LIMIT $2""",
            role, limit
        )

    history = []
    for r in rows:
        row_dict = dict(r)
        if row_dict.get("media"):
            try: row_dict["media"] = json.loads(row_dict["media"])
            except: row_dict["media"] = []
        history.append(row_dict)
    
    return history[::-1]  # Старые сверху

async def broadcast_to_role(target_role: str, event: str, data: dict, exclude_sid: str = None):
    if target_role in connected_users:
        for user in connected_users[target_role]:
            if user["sid"] != exclude_sid:
                await sio.emit(event, data, room=user["sid"])

# ================= ЗАПУСК =================
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 3000))
    uvicorn.run("chat:app", host="0.0.0.0", port=port, reload=True)