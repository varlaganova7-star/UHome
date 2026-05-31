from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class RequestCreate(BaseModel):
    category: str
    short_desc: str
    full_desc: Optional[str] = None
    priority: Optional[str] = "medium"
    room_number: Optional[str] = None

class StatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(pending|approved|assigned|in_progress|completed|rejected)$")

class AssignMaster(BaseModel):
    master_id: int

class RequestResponse(BaseModel):
    id: int
    student_id: int
    student_name: Optional[str]
    category: str
    short_desc: str
    full_desc: Optional[str]
    priority: str
    status: str
    assigned_master_id: Optional[int]
    master_name: Optional[str]
    room_number: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}