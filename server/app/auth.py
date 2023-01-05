import os

import jwt
from fastapi import Request, HTTPException

JWT_SECRET = os.getenv("JWT_SECRET", "61d91ee5-a4fe-4748-9a83-eea5d3054601")


async def get_current_user(request: Request):
    if request.headers.get('Authorization') is None:
        raise HTTPException(status_code=401)

    claims = jwt.decode(request.headers.get('Authorization').replace("Bearer ", ""), JWT_SECRET, algorithms=["HS256"])
    if claims.get("user_id") is None:
        raise HTTPException(status_code=401)

    return claims.get("user_id")
