from fastapi import APIRouter
from sqlalchemy import text
from database import engineconn
from schemas.recruit import RecruitCreate, RecruitRoleCreate
from fastapi import HTTPException

router = APIRouter()
engine = engineconn()

def get_user_role(user_id: int):
    conn = engine.connection()

    query = text("""
    SELECT mainrole 
    FROM userInfo 
    WHERE user_id = :user_id
    """)

    result = conn.execute(query, {"user_id": user_id}).fetchone()

    if result is None:
        return {"message": "유저 없음"}

    return result[0]

def create_team(title, desc, leader):
    conn = engine.connection()
    
    leader_role = get_user_role(leader)
    
    query = text("""
                insert into team
                (teamname, team_descript, leaderid, leader_role)
                values (:title, :desc, :leader, :leader_role) 
                 """)
    
    print(title, desc, leader, leader_role)
    
    conn.execute(query, {
        "title": title,
        "desc": desc,
        "leader": leader,
        "leader_role": leader_role
    })
    
    conn.commit()
    
    return "complete"

# 모집글 생성
@router.post("/recruit")
def create_recruit(data: RecruitCreate):
    conn = engine.connection()

    query = text("""
    INSERT INTO team_cruit 
    (title, cruit_descript, required_count, cruit_leader_id, is_closed, deadline)
    VALUES (:title, :desc, :count, :leader, false, :deadline)
    """)
        
    create_team(data.title, data.cruit_descript, data.cruit_leader_id)

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

@router.get("/recruit")
def get_all_recruits():
    conn = engine.connection()

    query = text("""
    SELECT *
    FROM team_cruit
    ORDER BY created_at DESC
    """)

    result = conn.execute(query).fetchall()

    recruits = [dict(row._mapping) for row in result]

    return {"recruits": recruits}


@router.get("/recruit/{cruit_id}")
def get_recruit(cruit_id: int):
    conn = engine.connection()

    query = text("""
    SELECT *
    FROM team_cruit
    WHERE cruit_id = :cruit_id
    """)

    result = conn.execute(query, {"cruit_id": cruit_id}).fetchone()

    if result is None:
        raise HTTPException(status_code=404, detail="모집글 없음")

    return {"recruit": dict(result._mapping)}

@router.get("/recruit/{cruit_id}/roles")
def get_recruit_roles(cruit_id: int):
    conn = engine.connection()

    query = text("""
    SELECT cruit_role_id, cruit_rolename
    FROM cruit_role
    WHERE cruit_id = :cruit_id
    """)

    result = conn.execute(query, {"cruit_id": cruit_id}).fetchall()

    roles = [dict(row._mapping) for row in result]

    return {"roles": roles}

@router.delete("/recruit/{cruit_id}")
def delete_recruit(cruit_id: int):
    conn = engine.connection()

    # 1️⃣ 모집글 존재 확인
    check_query = text("""
    SELECT * FROM team_cruit WHERE cruit_id = :cruit_id
    """)
    result = conn.execute(check_query, {"cruit_id": cruit_id}).fetchone()

    if result is None:
        raise HTTPException(status_code=404, detail="모집글 없음")

    # 2️⃣ 역할 먼저 삭제
    conn.execute(text("""
    DELETE FROM cruit_role WHERE cruit_id = :cruit_id
    """), {"cruit_id": cruit_id})

    # 3️⃣ 모집글 삭제
    conn.execute(text("""
    DELETE FROM team_cruit WHERE cruit_id = :cruit_id
    """), {"cruit_id": cruit_id})

    conn.commit()

    return {"message": "모집글 삭제 완료"}