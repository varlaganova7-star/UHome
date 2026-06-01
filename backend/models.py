from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from database import Base, SessionLocal
from datetime import datetime


class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True)

    fullname = Column(String)

    email = Column(String, unique=True)

    password = Column(String)

    role = Column(String)

    questionnaire = relationship("Questionnaire", back_populates="user", uselist=False)

from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship

class Questionnaire(Base):
    __tablename__ = "questionnaires"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    
    institute = Column(String)
    direction = Column(String)
    course = Column(String)
    gender = Column(String)
    bedtime = Column(String)
    wakeup = Column(String)
    sleep_noise = Column(String)
    noise_attitude = Column(Integer)
    guest_attitude = Column(Integer)
    call_attitude = Column(Integer)
    homework_time = Column(String)
    cooking_freq = Column(String)
    food_type = Column(String)
    smell_tolerance = Column(Boolean)
    sharing = Column(Boolean)
    
    user = relationship("User", back_populates="questionnaire")
class RepairRequest(Base):
    __tablename__ = "requests"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category = Column(String(100), nullable=False)
    short_desc = Column(String(255), nullable=False)
    full_desc = Column(Text)
    priority = Column(String(20), default="medium")  # low, medium, high
    status = Column(String(50), default="pending")   # pending, approved, assigned, in_progress, completed, rejected
    assigned_master_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    room_number = Column(String(20))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    student = relationship("User", foreign_keys=[student_id], lazy="joined")
    master = relationship("User", foreign_keys=[assigned_master_id], lazy="joined")

# Добавь это в класс User, если ещё нет:
# questionnaire = relationship("Questionnaire", back_populates="user", uselist=False)