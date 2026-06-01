from fastapi import FastAPI, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from database import get_db, engine, Base
from models import User, RepairRequest
from schemas import RequestCreate, StatusUpdate, AssignMaster, RequestResponse
from datetime import datetime

# Создаём таблицы при старте (в продакшене используйте Alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="UHome Repair API", version="1.0")

# 🔐 Зависимость для получения текущего пользователя (замените на JWT в продакшене)
async def get_current_user(
    x_user_id: int = Header(..., description="ID пользователя"),
    x_user_role: str = Header(..., description="Роль: student, studsovet, admin, master")
) -> dict:
    valid_roles = {"student", "studsovet", "admin", "master"}
    if x_user_role not in valid_roles:
        raise HTTPException(status_code=403, detail="Неверная роль")
    return {"id": x_user_id, "role": x_user_role}

# 📤 ПОДАЧА ЗАЯВКИ (только студент)
@app.post("/api/requests", response_model=RequestResponse)
def create_request(
    data: RequestCreate,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    if user["role"] != "student":
        raise HTTPException(403, "Только студенты могут подавать заявки")
    
    new_req = RepairRequest(
        student_id=user["id"],
        **data.model_dump()
    )
    db.add(new_req)
    db.commit()
    db.refresh(new_req)
    
    return RequestResponse(
        **new_req.__dict__,
        student_name=db.query(User.fullname).filter(User.id == new_req.student_id).scalar(),
        master_name=None
    )

# 📖 ПРОСМОТР ЗАЯВОК (фильтрация по роли)
@app.get("/api/requests", response_model=list[RequestResponse])
def get_requests(
    skip: int = 0, limit: int = 50,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    query = db.query(RepairRequest)
    
    if user["role"] == "student":
        query = query.filter(RepairRequest.student_id == user["id"])
    elif user["role"] == "master":
        query = query.filter(RepairRequest.assigned_master_id == user["id"])
    # admin и studsovet видят ВСЕ заявки
    
    requests = query.order_by(RepairRequest.created_at.desc()).offset(skip).limit(limit).all()
    
    result = []
    for req in requests:
        result.append(RequestResponse(
            **req.__dict__,
            student_name=req.student.fullname if req.student else "Удалён",
            master_name=req.master.fullname if req.master else None
        ))
    return result

# 🔄 ОБНОВЛЕНИЕ СТАТУСА (админ или назначенный мастер)
@app.patch("/api/requests/{req_id}/status")
def update_status(
    req_id: int, data: StatusUpdate,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    req = db.query(RepairRequest).filter(RepairRequest.id == req_id).first()
    if not req: raise HTTPException(404, "Заявка не найдена")
    
    # 🔒 Проверка прав
    if user["role"] == "student":
        raise HTTPException(403, "Студенты не могут менять статус")
    if user["role"] == "master" and req.assigned_master_id != user["id"]:
        raise HTTPException(403, "Вы можете менять статус только назначенных вам заявок")
        
    req.status = data.status
    req.updated_at = datetime.utcnow()
    db.commit()
    return {"message": f"✅ Статус изменён на '{data.status}'"}

# 👷 НАЗНАЧЕНИЕ МАСТЕРА (только админ/студсовет)
@app.patch("/api/requests/{req_id}/assign")
def assign_master(
    req_id: int, data: AssignMaster,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    if user["role"] not in ["admin", "studsovet"]:
        raise HTTPException(403, "Назначать мастеров может только администрация")
        
    req = db.query(RepairRequest).filter(RepairRequest.id == req_id).first()
    if not req: raise HTTPException(404, "Заявка не найдена")
    
    master = db.query(User).filter(User.id == data.master_id, User.role == "master").first()
    if not master: raise HTTPException(404, "Мастер не найден или имеет неверную роль")
    
    req.assigned_master_id = master.id
    req.status = "assigned"
    req.updated_at = datetime.utcnow()
    db.commit()
    return {"message": f"✅ Заявка назначена на {master.fullname} ({master.specialization})"}