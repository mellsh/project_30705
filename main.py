from fastapi import FastAPI
from routes import userAuthor, userNotoriety, teamRecruit, team
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],  # ← 올바른 철자
    allow_headers=["*"],
)

app.include_router(userAuthor.router, prefix="/user")
app.include_router(userNotoriety.router, prefix="/notoriety")
app.include_router(teamRecruit.router, prefix="/team")
app.include_router(team.router, prefix="/team")
