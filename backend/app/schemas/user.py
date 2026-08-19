from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    daily_word_goal: int

    model_config = {
        "from_attributes": True,
    }

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class WritingGoalUpdate(BaseModel):
    daily_word_goal: int = Field(
        ge=1,
        le=100000,
    )