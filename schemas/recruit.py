from pydantic import BaseModel
from datetime import datetime

class RecruitCreate(BaseModel):
    title: str
    cruit_descript: str
    required_count: int
    cruit_leader_id: int
    deadline: datetime

class RecruitRoleCreate(BaseModel):
    cruit_id: int
    cruit_rolename: str