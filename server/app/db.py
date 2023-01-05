import os

from sqlalchemy import (Column, DateTime, Integer, String, LargeBinary, Table, ForeignKey, create_engine, MetaData)
from sqlalchemy.sql import func
from databases import Database

DATABASE_URL = os.getenv("DATABASE_URL", "mysql://test_user:test_user@localhost:3306/test_db")

engine = create_engine(DATABASE_URL)
metadata = MetaData()
user = Table(
    "user",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("username", String(255), unique=True),
    Column("password", String(255)),
    Column("created_date", DateTime, default=func.now(), nullable=False)
)
image = Table(
    "image",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("user_id", ForeignKey("user.id")),
    Column("name", String(255)),
    Column("image", LargeBinary(length=(2**32)-1)),
    Column("created_date", DateTime, default=func.now(), nullable=False)
)
annotation = Table(
    "annotation",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("image_id", ForeignKey("image.id")),
    Column("coordinates", String(255)),
    Column("type", String(255)),
    Column("created_date", DateTime, default=func.now(), nullable=False)
)

database = Database(DATABASE_URL)
