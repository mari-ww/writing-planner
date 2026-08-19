from pydantic import BaseModel, Field


class CharacterCreate(BaseModel):
    name: str = Field(
        min_length=1,
        max_length=255,
    )
    description: str | None = None
    role: str | None = Field(
        default=None,
        max_length=100,
    )


class CharacterUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )
    description: str | None = None
    role: str | None = Field(
        default=None,
        max_length=100,
    )


class CharacterResponse(BaseModel):
    id: int
    name: str
    description: str | None
    role: str | None
    project_id: int

    model_config = {
        "from_attributes": True,
    }