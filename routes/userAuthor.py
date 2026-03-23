from fastapi import APIRouter, HTTPException
from database import engineconn
from schemas.userAuthor import UserCreate, UserLogin
from sqlalchemy import text
import hashlib

router = APIRouter()

engine = engineconn()

@router.post("/signup")
def signup(user: UserCreate):
    conn = engine.connection()

    hashed_pw = hashlib.sha256(user.password.encode()).hexdigest()

    query = text("""
        INSERT INTO userInfo (username, password, name, age, mainrole, descript)
        VALUES (:username, :password, :name, :age, :mainrole, :descript)
        """)

    try:
        conn.execute(query, {
        "username": user.username,
        "password": hashed_pw,
        "name": user.name,
        "age": user.age,
        "mainrole": user.mainrole,
        "descript": user.descript
    })
        conn.commit()
        return {"message": "회원가입 성공"}
    except Exception as e:
        print(e)  # 👈 이거 추가
        raise HTTPException(status_code=400, detail=str(e))
    
@router.post("/login")
def login(user: UserLogin):
    conn = engine.connection()

    hashed_pw = hashlib.sha256(user.password.encode()).hexdigest()
    
    query = text("""
        select * from userInfo where username = (:username) and password = (:password)
        """)

    try:
        conn.execute(query, {
        "username": user.username,
        "password": hashed_pw,
    })
        conn.commit()
        return {"message": "로그인 성공"}
    except Exception as e:
        print(e)  # 👈 이거 추가
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/delete/{user_id}")
def delete_user(user_id: int):
    conn = engine.connection()

    query = text("""
        delete from userInfo where user_id=(:user_id)
        """)

    try:
        conn.execute(query, {
        "user_id": user_id,
    })
        conn.commit()
        return {"message": "회원 삭제 성공"}
    except Exception as e:
        print(e)  # 👈 이거 추가
        raise HTTPException(status_code=400, detail=str(e))
    
@router.get("/get")
def get_users():
    conn = engine.connection()
    
    query = text("SELECT user_id, username, name, age, mainrole, descript FROM userInfo")

    result = conn.execute(query).fetchall()
    
    users = []
    for row in result:
        users.append({
            "user_id": row[0],
            "username": row[1],
            "name": row[2],
            "age": row[3],
            "mainrole": row[4]
        })

    return {"users": users}

@router.get("/get/{user_id}")
def get_users(user_id: int):
    conn = engine.connection()
    
    query = text("SELECT user_id, username, name, age, mainrole, descript FROM userInfo where user_id=(:user_id)")

    result = conn.execute(query, {"user_id": user_id}).fetchall()
    
    users = []
    for row in result:
        users.append({
            "user_id": row[0],
            "username": row[1],
            "name": row[2],
            "age": row[3],
            "mainrole": row[4]
        })

    return {"users": users}
        