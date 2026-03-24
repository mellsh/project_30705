from fastapi import APIRouter
from sqlalchemy import text
from database import engineconn
from schemas.notoriety import NotorietyCreate, EvaluationCreate

router = APIRouter()
engine = engineconn()

# 평판 생성
@router.post("/notoriety")
def create_notoriety(data: NotorietyCreate):
    conn = engine.connection()

    query = text("""
    INSERT INTO userNotoriety (user_id, notoriety)
    VALUES (:user_id, :notoriety)
    """)

    conn.execute(query, {
        "user_id": data.user_id,
        "notoriety": data.notoriety
    })
    conn.commit()

    return {"message": "평판 생성 완료"}

# 평가 작성
@router.post("/evaluation")
def create_evaluation(data: EvaluationCreate):
    conn = engine.connection()

    query = text("""
    INSERT INTO userEvaluation (notorietyid, evaluations)
    VALUES (:notorietyid, :evaluations)
    """)

    conn.execute(query, {
        "notorietyid": data.notorietyid,
        "evaluations": data.evaluations
    })
    conn.commit()

    return {"message": "평가 작성 완료"}