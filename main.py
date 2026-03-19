from fastapi import FastAPI, Depends, Path, HTTPException
from pydantic import BaseModel
from database import engineconn
from models import UserInfo

app = FastAPI()

engine = engineconn()
session = engine.sessionmaker()


class Item(BaseModel):
    user_id : int
    name : str
    age : int
    mainrole : str
    participation : int
    descript : str

@app.get("/")
async def first_get():
    example = session.query(UserInfo).all()
    return example