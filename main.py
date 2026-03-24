from fastapi import FastAPI
from routes import userAuthor, userNotoriety  # 👈 이거 중요

app = FastAPI()

app.include_router(userAuthor.router, prefix="/user")
app.include_router(userNotoriety.router, prefix="/notoriety")


