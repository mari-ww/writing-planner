from pydantic import BaseModel, Field


class ChapterCreate(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=255,
    )
    content: str = ""


class ChapterUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )
    content: str | None = None


class ChapterResponse(BaseModel):
    id: int
    title: str
    content: str
    position: int
    project_id: int

    model_config = {
        "from_attributes": True,
    }