from fastapi import APIRouter
from sqlalchemy import text
from database import engineconn
from schemas.recruit import RecruitCreate, RecruitRoleCreate

router = APIRouter()
engine = engineconn()

# 모집글 생성
@router.post("/recruit")
def create_recruit(data: RecruitCreate):
    conn = engine.connection()

    query = text("""
    INSERT INTO team_cruit 
    (title, cruit_descript, required_count, cruit_leader_id, is_closed, deadline)
    VALUES (:title, :desc, :count, :leader, false, :deadline)
    """)

    conn.execute(query, {
        "title": data.title,
        "desc": data.cruit_descript,
        "count": data.required_count,
        "leader": data.cruit_leader_id,
        "deadline": data.deadline
    })
    conn.commit()

    return {"message": "모집글 생성 완료"}

# 모집 역할 추가
@router.post("/recruit/role")
def add_role(data: RecruitRoleCreate):
    conn = engine.connection()

    query = text("""
    INSERT INTO cruit_role (cruit_id, cruit_rolename)
    VALUES (:cruit_id, :rolename)
    """)

    conn.execute(query, {
        "cruit_id": data.cruit_id,
        "rolename": data.cruit_rolename
    })
    conn.commit()

    return {"message": "역할 추가 완료"}