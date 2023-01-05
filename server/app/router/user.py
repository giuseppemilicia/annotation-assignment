import bcrypt
import jwt
from fastapi import APIRouter, HTTPException
from pymysql import err

from app.auth import JWT_SECRET
from app.db import database, user
from app.model.user import UserModel

router = APIRouter()


@router.post("/login")
async def login(payload: UserModel):
    query = user.select().where(payload.username == user.c.username)
    result = await database.fetch_one(query=query)
    if result is None:
        raise HTTPException(status_code=404, detail="Username invalid")
    if bcrypt.checkpw(payload.password.encode('utf8'), result.password.encode('utf8')):
        jwt_token = jwt.encode({"user_id": result.id}, JWT_SECRET, algorithm="HS256")
        return {"id": result.id, "username": result.username, "authorization": "Bearer " + jwt_token}

    raise HTTPException(status_code=400, detail="Username or password invalid")


@router.post("/signup")
async def signup(payload: UserModel):
    salt = bcrypt.gensalt()
    pwd_hashed = bcrypt.hashpw(payload.password.encode('utf8'), salt)
    query = user.insert().values(username=payload.username, password=pwd_hashed)
    try:
        user_id = await database.execute(query=query)
    except err.IntegrityError:
        raise HTTPException(status_code=400, detail="Username already used")

    jwt_token = jwt.encode({"user_id": user_id}, JWT_SECRET, algorithm="HS256")
    return {"id": user_id, "username": payload.username, "authorization": "Bearer " + jwt_token}
