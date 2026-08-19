from pydantic import BaseModel, Field


class ProjectCreate(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=255,
    )
    description: str | None = None
    genre: str | None = None
    cover_color: str | None = None


class ProjectUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )
    description: str | None = None
    genre: str | None = None
    cover_color: str | None = None


class ProjectResponse(BaseModel):
    id: int
    title: str
    description: str | None
    genre: str | None
    cover_color: str | None
    user_id: int

    model_config = {
        "from_attributes": True,
    }