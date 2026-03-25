from pydantic import BaseModel

class TeamMemberCreate(BaseModel):
    team_id: int
    user_id: int
    member_role: str