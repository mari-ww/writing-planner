from pydantic import BaseModel, Field


class TaskCreate(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=255,
    )

    chapter_id: int | None = None


class TaskUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )

    completed: bool | None = None

    chapter_id: int | None = None


class TaskResponse(BaseModel):
    id: int
    title: str
    completed: bool
    project_id: int
    chapter_id: int | None

    model_config = {
        "from_attributes": True,
    }