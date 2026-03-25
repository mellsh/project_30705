from fastapi import APIRouter
from sqlalchemy import text
from database import engineconn
from schemas.team import TeamMemberCreate
from fastapi import APIRouter, HTTPException

router = APIRouter()
engine = engineconn()

# 팀 목록 조회
@router.get("/teams")
def get_teams():
    conn = engine.connection()

    query = text("SELECT * FROM team")
    result = conn.execute(query).fetchall()

    teams = [dict(row._mapping) for row in result]

    return {"teams": teams}


# 특정 팀 + 팀원 조회 (JOIN)
@router.get("/teams/{team_id}")
def get_team_detail(team_id: int):
    conn = engine.connection()

    query = text("""
    SELECT t.team_id, t.teamname, t.team_descript,
           u.user_id, u.username, tm.member_role
    FROM team t
    JOIN team_member tm ON t.team_id = tm.team_id
    JOIN userInfo u ON tm.user_id = u.user_id
    WHERE t.team_id = :team_id
    """)

    result = conn.execute(query, {"team_id": team_id}).fetchall()

    members = [dict(row._mapping) for row in result]

    return {"team_members": members}

@router.post("/team/member")
def add_team_member(data: TeamMemberCreate):
    conn = engine.connection()

    # 1️⃣ 팀 존재 확인
    team_check = conn.execute(
        text("SELECT * FROM team WHERE team_id = :team_id"),
        {"team_id": data.team_id}
    ).fetchone()

    if team_check is None:
        raise HTTPException(status_code=404, detail="팀 없음")

    # 2️⃣ 유저 존재 확인
    user_check = conn.execute(
        text("SELECT * FROM userInfo WHERE user_id = :user_id"),
        {"user_id": data.user_id}
    ).fetchone()

    if user_check is None:
        raise HTTPException(status_code=404, detail="유저 없음")

    # 3️⃣ 중복 방지 (이미 팀원인지)
    duplicate_check = conn.execute(
        text("""
        SELECT * FROM team_member 
        WHERE team_id = :team_id AND user_id = :user_id
        """),
        {"team_id": data.team_id, "user_id": data.user_id}
    ).fetchone()

    if duplicate_check:
        raise HTTPException(status_code=400, detail="이미 팀원임")

    # 4️⃣ 팀원 추가
    conn.execute(text("""
    INSERT INTO team_member (team_id, user_id, member_role)
    VALUES (:team_id, :user_id, :role)
    """), {
        "team_id": data.team_id,
        "user_id": data.user_id,
        "role": data.member_role
    })

    conn.commit()

    return {"message": "팀원 추가 완료"}

@router.delete("/team/member")
def delete_team_member(team_id: int, user_id: int):
    conn = engine.connection()

    # 1️⃣ 존재 확인
    check = conn.execute(
        text("""
        SELECT * FROM team_member
        WHERE team_id = :team_id AND user_id = :user_id
        """),
        {"team_id": team_id, "user_id": user_id}
    ).fetchone()

    if check is None:
        raise HTTPException(status_code=404, detail="팀원 없음")

    # 2️⃣ 삭제
    conn.execute(
        text("""
        DELETE FROM team_member
        WHERE team_id = :team_id AND user_id = :user_id
        """),
        {"team_id": team_id, "user_id": user_id}
    )

    conn.commit()

    return {"message": "팀원 삭제 완료"}

@router.delete("/team/{team_id}")
def delete_team(team_id: int):
    conn = engine.connection()

    # 1️⃣ 팀 존재 확인
    team = conn.execute(
        text("SELECT * FROM team WHERE team_id = :team_id"),
        {"team_id": team_id}
    ).fetchone()

    if team is None:
        raise HTTPException(status_code=404, detail="팀 없음")

    # 2️⃣ 팀원 먼저 삭제
    conn.execute(
        text("DELETE FROM team_member WHERE team_id = :team_id"),
        {"team_id": team_id}
    )

    # 3️⃣ 팀 삭제
    conn.execute(
        text("DELETE FROM team WHERE team_id = :team_id"),
        {"team_id": team_id}
    )

    conn.commit()

    return {"message": "팀 삭제 완료"}