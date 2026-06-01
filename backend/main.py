# =========================
# 🔼 ИМПОРТЫ (всегда вверху!)
# =========================
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from passlib.context import CryptContext  # ✅ Перенесено ВВЕРХ!

from database import SessionLocal, engine, Base
from models import User
from neighbor_routes import router as neighbor_router

# =========================
# 🔐 НАСТРОЙКИ ПАРОЛЕЙ
# =========================
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# =========================
# 🗄 ИНИЦИАЛИЗАЦИЯ
# =========================
Base.metadata.create_all(bind=engine)
app = FastAPI(title="UHome API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры
app.include_router(neighbor_router)

# =========================
# 📐 SCHEMAS
# =========================
class UserCreate(BaseModel):
    fullname: str
    email: str
    password: str
    role: str

class UserLogin(BaseModel):
    email: str
    password: str

# =========================
# 📤 REGISTER
# =========================
@app.post("/register")
def register(user: UserCreate):
    db: Session = SessionLocal()
    print(f"🔍 Регистрация: {user.email}")
    
    try:
        existing_user = db.query(User).filter(User.email == user.email).first()
        if existing_user:
            print(f"⚠️ Email {user.email} уже существует")
            return {"error": "Email already exists"}
        
        print("🔐 Хэширую пароль...")
        hashed = hash_password(user.password)
        print(f"✅ Хэш получен: {hashed[:20]}...")
        
        new_user = User(
            fullname=user.fullname,
            email=user.email,
            password=hashed,
            role=user.role
        )
        
        print("💾 Добавляю в сессию...")
        db.add(new_user)
        
        print("🔄 Выполняю commit...")
        db.commit()  # 🔥 КРИТИЧНО!
        print("✅ COMMIT выполнен!")
        
        db.refresh(new_user)
        print(f"🎉 Пользователь создан с ID: {new_user.id}")
        
        return {"message": "User created", "id": new_user.id}
        
    except Exception as e:
        print(f"❌ ОШИБКА в register: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()  # 🔥 Закрываем соединение!

# =========================
# 🔐 LOGIN
# =========================
@app.post("/login")
def login(user: UserLogin):
    db: Session = SessionLocal()
    try:
        db_user = db.query(User).filter(User.email == user.email).first()
        
        if not db_user:
            return {"error": "User not found"}, 404
        if not verify_password(user.password, db_user.password):
            return {"error": "Wrong password"}, 401

        return {
            "id": db_user.id,
            "fullname": db_user.fullname,
            "role": db_user.role,
            "message": "Success"
        }
    finally:
        db.close()  # 🔥 Закрываем соединение!