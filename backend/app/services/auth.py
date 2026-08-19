from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from app.repositories.user import UserRepository
from app.schemas.user import UserCreate


class AuthService:
    def __init__(self):
        self.user_repository = UserRepository()

    def register(
        self,
        db: Session,
        user_data: UserCreate,
    ) -> User:
        existing_user = self.user_repository.get_by_email(
            db,
            user_data.email,
        )

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered",
            )

        return self.user_repository.create(
            db=db,
            email=user_data.email,
            password_hash=hash_password(user_data.password),
        )

    def login(
        self,
        db: Session,
        email: str,
        password: str,
    ) -> str:
        user = self.user_repository.get_by_email(
            db,
            email,
        )

        if not user or not verify_password(
            password,
            user.password_hash,
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        return create_access_token(str(user.id))