from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.character import (
    CharacterCreate,
    CharacterResponse,
    CharacterUpdate,
)
from app.services.character import CharacterService
from app.services.project import ProjectService


router = APIRouter(
    prefix="/projects/{project_id}/characters",
    tags=["Characters"],
)

character_service = CharacterService()
project_service = ProjectService()


def get_project_for_current_user(
    project_id: int,
    db: Session,
    current_user: User,
):
    return project_service.get_owned_project(
        db,
        project_id,
        current_user,
    )


@router.post(
    "",
    response_model=CharacterResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_character(
    project_id: int,
    data: CharacterCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = get_project_for_current_user(
        project_id,
        db,
        current_user,
    )

    return character_service.create(
        db,
        project,
        data,
    )


@router.get(
    "",
    response_model=list[CharacterResponse],
)
def list_characters(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = get_project_for_current_user(
        project_id,
        db,
        current_user,
    )

    return character_service.list_by_project(
        db,
        project,
    )


@router.get(
    "/{character_id}",
    response_model=CharacterResponse,
)
def get_character(
    project_id: int,
    character_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = get_project_for_current_user(
        project_id,
        db,
        current_user,
    )

    return character_service.get_project_character(
        db,
        character_id,
        project,
    )


@router.patch(
    "/{character_id}",
    response_model=CharacterResponse,
)
def update_character(
    project_id: int,
    character_id: int,
    data: CharacterUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = get_project_for_current_user(
        project_id,
        db,
        current_user,
    )

    character = character_service.get_project_character(
        db,
        character_id,
        project,
    )

    return character_service.update(
        db,
        character,
        data,
    )


@router.delete(
    "/{character_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_character(
    project_id: int,
    character_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = get_project_for_current_user(
        project_id,
        db,
        current_user,
    )

    character = character_service.get_project_character(
        db,
        character_id,
        project,
    )

    character_service.delete(db, character)

    return Response(
        status_code=status.HTTP_204_NO_CONTENT
    )