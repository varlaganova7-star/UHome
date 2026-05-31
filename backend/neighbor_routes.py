from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Questionnaire
from pydantic import BaseModel
from typing import Optional
from matching import find_matches

router = APIRouter(prefix="/api/neighbor", tags=["neighbor"])

class QuestionnaireSchema(BaseModel):
    user_id: int
    institute: str
    direction: str
    course: str
    gender: str
    bedtime: Optional[str] = None
    wakeup: Optional[str] = None
    sleep_noise: Optional[str] = None
    noise_attitude: Optional[int] = None
    guest_attitude: Optional[int] = None
    call_attitude: Optional[int] = None
    homework_time: Optional[str] = None
    cooking_freq: Optional[str] = None
    food_type: Optional[str] = None
    smell_tolerance: Optional[bool] = None
    sharing: Optional[bool] = None

@router.post("/questionnaire")
def save_questionnaire(data: QuestionnaireSchema, db: Session = Depends(get_db)):
    existing = db.query(Questionnaire).filter(Questionnaire.user_id == data.user_id).first()
    if existing:
        for k, v in data.model_dump(exclude={'user_id'}).items():
            setattr(existing, k, v)
        db.commit()
        db.refresh(existing)
        return {"message": "Updated", "id": existing.id}
    new_q = Questionnaire(**data.model_dump())
    db.add(new_q)
    db.commit()
    db.refresh(new_q)
    return {"message": "Created", "id": new_q.id}

@router.get("/matches/{user_id}")
def get_matches(user_id: int, min_compat: float = 50.0, db: Session = Depends(get_db)):
    return {"matches": find_matches(db, user_id, min_compat)}