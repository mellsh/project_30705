from sqlalchemy import Column, TEXT, INT, BIGINT, VARCHAR
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class UserInfo(Base):
    __tablename__ = "userInfo"

    user_id = Column(INT, nullable=False, autoincrement=True, primary_key=True)
    name = Column(VARCHAR(60), nullable=False)
    age = Column(INT, nullable=False)
    mainrole = Column(VARCHAR(180), nullable=False)
    participation = Column(INT, nullable=True)
    descript = Column(TEXT, nullable=True)