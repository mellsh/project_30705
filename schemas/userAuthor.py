from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str
    name: str
    age: int
    mainrole: str
    descript: str

class UserLogin(BaseModel):
    username: str
    password: str