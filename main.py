from fastapi import FastAPI
from routes import userAuthor, userNotoriety, teamRecruit, team

app = FastAPI()

app.include_router(userAuthor.router, prefix="/user")
app.include_router(userNotoriety.router, prefix="/notoriety")
app.include_router(teamRecruit.router, prefix="/team")
app.include_router(team.router, prefix="/team")
