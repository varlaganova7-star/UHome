from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base, SessionLocal

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

# Добавь это в класс User, если ещё нет:
# questionnaire = relationship("Questionnaire", back_populates="user", uselist=False)