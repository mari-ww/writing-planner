from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.user import (
    UserResponse,
    WritingGoalUpdate,
)


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.get(
    "/me",
    response_model=UserResponse,
)
def get_current_user_profile(
    current_user: User = Depends(get_current_user),
):
    return current_user


@router.patch(
    "/me/writing-goal",
    response_model=UserResponse,
)
def update_writing_goal(
    data: WritingGoalUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    current_user.daily_word_goal = (
        data.daily_word_goal
    )

    db.commit()
    db.refresh(current_user)

    return current_user