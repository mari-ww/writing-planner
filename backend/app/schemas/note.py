from pydantic import BaseModel, Field


class NoteCreate(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=255,
    )
    content: str = Field(min_length=1)


class NoteUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )
    content: str | None = Field(
        default=None,
        min_length=1,
    )


class NoteResponse(BaseModel):
    id: int
    title: str
    content: str
    project_id: int

    model_config = {
        "from_attributes": True,
    }