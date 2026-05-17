import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncpg
import json
import os

# ==========================================
# КОНФИГУРАЦИЯ
# ==========================================
DB_DSN = "postgresql://postgres:ВАШ_ПАРОЛЬ@localhost:5432/uhome_chat"
JWT_SECRET = "super_secret_key" # Должен совпадать с тем, что в JS

# Инициализация Socket.IO (Совместим с клиентом JS Socket.IO)
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins="*", # Разрешаем подключения с любого домена
    logger=True
)
socket_app = socketio.ASGIApp(sio)

# Инициализация FastAPI
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем Socket.IO к FastAPI
app.mount("/", socket_app)

db_pool = None

# ==========================================
# СОБЫТИЯ ЖИЗНЕННОГО ЦИКЛА
# ==========================================

@app.on_event("startup")
async def startup():
    global db_pool
    try:
        db_pool = await asyncpg.create_pool(dsn=DB_DSN)
        print("✅ PostgreSQL подключена")
    except Exception as e:
        print(f"❌ Ошибка подключения к БД: {e}")

# ==========================================
# ЛОГИКА ЧАТА (Socket.IO)
# ==========================================

# Хранилище подключенных пользователей (Role -> List of Socket IDs)
connected_users = {}

@sio.on('connect')
async def connect(sid, environ):
    print(f"🔗 Пользователь подключился: {sid}")
    # Здесь можно проверить токен авторизации из cookies/query

@sio.on('register_user')
async def register_user(sid, data):
    """Клиент отправляет свою роль и имя при подключении"""
    role = data.get('role')
    name = data.get('name')
    
    # Сохраняем пользователя в памяти сервера
    if role not in connected_users:
        connected_users[role] = []
    connected_users[role].append({'sid': sid, 'name': name})
    
    print(f"👤 Зарегистрирован: {name} ({role})")
    await sio.emit('system_message', {'text': f'Вы вошли как {role}'}, room=sid)

@sio.on('send_message')
async def send_message(sid, data):
    global db_pool
    if not db_pool:
        await sio.emit('error', {'text': 'База данных недоступна'}, room=sid)
        return

    sender_info = None
    # Находим отправителя по SID
    for role, users in connected_users.items():
        for u in users:
            if u['sid'] == sid:
                sender_info = {'role': role, 'name': u['name']}
                break
    
    if not sender_info:
        return

    text = data.get('text', '')
    recipient_role = data.get('recipient', 'admin')
    media = data.get('media', [])

    # 🔥 ПРОВЕРКА ПРАВ ДОСТУПА (Ваша логика)
    # Если отправитель НЕ админ, он может писать ТОЛЬКО админу
    if sender_info['role'] != 'admin' and recipient_role != 'admin':
        await sio.emit('error', {
            'text': '❌ Ошибка: Студенты и мастера могут писать только администрации!'
        }, room=sid)
        return

    # 1. Сохраняем в Базу Данных
    try:
        await db_pool.execute(
            """INSERT INTO messages (sender_role, sender_name, recipient_role, text, media)
               VALUES ($1, $2, $3, $4, $5)""",
            sender_info['role'], sender_info['name'], recipient_role, text, json.dumps(media)
        )
    except Exception as e:
        print(f"Ошибка БД: {e}")

    # 2. Формируем объект сообщения для отправки
    message_obj = {
        'id': 0, # В реальном коде лучше вернуть ID из INSERT
        'sender_role': sender_info['role'],
        'sender_name': sender_info['name'],
        'recipient_role': recipient_role,
        'text': text,
        'media': media,
        'created_at': str(__import__('datetime').datetime.now())
    }

    # 3. Рассылка сообщений (Broadcasting)
    
    # Кому отправлять?
    # 1. Отправителю (чтобы сообщение отобразилось у него)
    await sio.emit('new_message', message_obj, room=sid)

    # 2. Получателям
    if recipient_role == 'admin':
        # Если пишем админу -> отправляем всем админам (или всем, если админ один)
        # В данном случае отправим всем, у кого роль admin
        if 'admin' in connected_users:
            for user in connected_users['admin']:
                if user['sid'] != sid: # Не дублировать отправителю
                    await sio.emit('new_message', message_obj, room=user['sid'])
    else:
        # Если админ пишет студенту -> отправляем конкретному студенту (или всем студентам)
        # Здесь упрощенно: отправляем всем студентам
        if recipient_role in connected_users:
            for user in connected_users[recipient_role]:
                if user['sid'] != sid:
                    await sio.emit('new_message', message_obj, room=user['sid'])

@sio.on('get_history')
async def get_history(sid, data):
    global db_pool
    if not db_pool: return
    
    # Находим роль пользователя
    user_role = None
    for role, users in connected_users.items():
        if any(u['sid'] == sid for u in users):
            user_role = role
            break

    if not user_role: return

    # ЛОГИКА ВЫБОРКИ ИЗ БД
    if user_role == 'admin':
        # Админ видит всё
        rows = await db_pool.fetch("SELECT * FROM messages ORDER BY created_at DESC LIMIT 50")
    else:
        # Студент/Мастер видит только переписку с Админом
        rows = await db_pool.fetch(
            """SELECT * FROM messages 
               WHERE (sender_role = $1 AND recipient_role = 'admin') 
                  OR (sender_role = 'admin' AND recipient_role = $1)
               ORDER BY created_at DESC LIMIT 50""",
            user_role
        )

    # Преобразуем в список и отправляем
    history = [dict(r) for r in rows]
    # Парсим JSON поля media
    for msg in history:
        if msg['media']:
            msg['media'] = json.loads(msg['media'])
            
    # Отправляем историю в обратном порядке (старые сверху)
    await sio.emit('history', history[::-1], room=sid)

@sio.on('disconnect')
async def disconnect(sid):
    # Удаляем пользователя из connected_users
    for role, users in connected_users.items():
        connected_users[role] = [u for u in users if u['sid'] != sid]
    print(f"🔌 Пользователь отключился: {sid}")

# ==========================================
# ЗАПУСК
# ==========================================
if __name__ == "__main__":
    import uvicorn
    # Запускаем сервер на порту 3000
    uvicorn.run("main:app", host="0.0.0.0", port=3000, reload=True)