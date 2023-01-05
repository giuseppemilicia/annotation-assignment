from pydantic import BaseModel


class AnnotationModel(BaseModel):
    coordinates: str
    type: str


class AnnotationsModel(BaseModel):
    annotations: list[AnnotationModel]
