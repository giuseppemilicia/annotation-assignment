from fastapi import APIRouter, UploadFile, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy import select

from app.auth import get_current_user
from app.db import database, annotation, image
from app.model.image import AnnotationsModel

router = APIRouter()


@router.post("/")
async def upload(file: UploadFile, user_id: int = Depends(get_current_user)):
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail=f"File type of {file.content_type} is not supported")
    query = image.insert().values(user_id=user_id, name=file.filename, image=file.file.read())
    image_id = await database.execute(query=query)
    return {"id": image_id, "filename": file.filename}


@router.get("/")
async def image_list(user_id: int = Depends(get_current_user), only_annotated: bool = False):
    query = select([image.c.id, image.c.name, image.c.created_date]) \
        .where((user_id == image.c.user_id)) \
        .distinct(image.c.id)
    if only_annotated:
        query = query.join(annotation)
    result = await database.fetch_all(query=query)
    return {"results": result}


@router.get("/{image_id}")
async def image_blob(image_id: int, user_id: int = Depends(get_current_user)):
    query = image.select().where((user_id == image.c.user_id) & (image_id == image.c.id))
    result = await database.fetch_one(query=query)
    return Response(content=result.image)


@router.post("/{image_id}/annotation")
async def save_image_annotation(image_id: int, payload: AnnotationsModel, user_id: int = Depends(get_current_user)):
    query = select([image.c.id]).where((user_id == image.c.user_id) & (image_id == image.c.id))
    result = await database.fetch_one(query=query)
    if result is None:
        raise HTTPException(status_code=403)

    inserted_ids = []
    delete = annotation.delete().where(image_id == annotation.c.image_id)
    await database.execute(query=delete)
    for ann in payload.annotations:
        query = annotation.insert().values(image_id=image_id, coordinates=ann.coordinates, type=ann.type)
        inserted_ids.append(await database.execute(query=query))
    return {"ids": inserted_ids}


@router.get("/{image_id}/annotation")
async def get_image_annotation(image_id: int, user_id: int = Depends(get_current_user)):
    query = select([annotation.c.id, image.c.name, annotation.c.coordinates, annotation.c.type, annotation.c.created_date]) \
        .join(annotation) \
        .where((user_id == image.c.user_id) & (image_id == image.c.id))
    result = await database.fetch_all(query=query)
    return {"results": result}
