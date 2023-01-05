import time

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.router import user, image
from app.db import engine, metadata, database

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    while True:
        try:
            metadata.create_all(engine)
            await database.connect()
            break
        except Exception as e:
            print("An exception has occurred, retrying...", e)
            time.sleep(5)


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


app.include_router(user.router, prefix="/v1/users")
app.include_router(image.router, prefix="/v1/images")
