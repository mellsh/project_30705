from fastapi import FastAPI
from routes import userAuthor   # 👈 이거 중요

app = FastAPI()

app.include_router(userAuthor.router, prefix="/user")

