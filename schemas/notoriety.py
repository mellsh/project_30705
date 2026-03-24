from pydantic import BaseModel

class NotorietyCreate(BaseModel):
    user_id: int
    notoriety: int

class EvaluationCreate(BaseModel):
    notorietyid: int
    evaluations: str