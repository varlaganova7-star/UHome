from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import SessionLocal, engine, Base
from models import User

from auth import (
    hash_password,
    verify_password
)

from pydantic import BaseModel

Base.metadata.create_all(bind=engine)

app = FastAPI()

# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# SCHEMAS
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
# REGISTER
# =========================

@app.post("/register")
def register(user: UserCreate):

    db: Session = SessionLocal()

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:

        return {
            "error": "Email already exists"
        }

    hashed = hash_password(
        user.password
    )

    new_user = User(
        fullname=user.fullname,
        email=user.email,
        password=hashed,
        role=user.role
    )

    db.add(new_user)

    db.commit()

    return {
        "message": "User created"
    }


# =========================
# LOGIN
# =========================

@app.post("/login")
def login(user: UserLogin):

    db: Session = SessionLocal()

    db_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not db_user:

        return {
            "error": "User not found"
            
        }

    valid = verify_password(
        user.password,
        db_user.password
    )

    if not valid:

        return {
            "error": "Wrong password"
        }

    return {
        "message": "Success",
        "role": db_user.role,
        "fullname": db_user.fullname
    }