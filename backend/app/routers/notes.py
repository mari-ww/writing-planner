from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.note import (
    NoteCreate,
    NoteResponse,
    NoteUpdate,
)
from app.services.note import NoteService
from app.services.project import ProjectService


router = APIRouter(
    prefix="/projects/{project_id}/notes",
    tags=["Notes"],
)

note_service = NoteService()
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
    response_model=NoteResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_note(
    project_id: int,
    data: NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = get_project_for_current_user(
        project_id,
        db,
        current_user,
    )

    return note_service.create(
        db,
        project,
        data,
    )


@router.get(
    "",
    response_model=list[NoteResponse],
)
def list_notes(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = get_project_for_current_user(
        project_id,
        db,
        current_user,
    )

    return note_service.list_by_project(
        db,
        project,
    )


@router.get(
    "/{note_id}",
    response_model=NoteResponse,
)
def get_note(
    project_id: int,
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = get_project_for_current_user(
        project_id,
        db,
        current_user,
    )

    return note_service.get_project_note(
        db,
        note_id,
        project,
    )


@router.patch(
    "/{note_id}",
    response_model=NoteResponse,
)
def update_note(
    project_id: int,
    note_id: int,
    data: NoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = get_project_for_current_user(
        project_id,
        db,
        current_user,
    )

    note = note_service.get_project_note(
        db,
        note_id,
        project,
    )

    return note_service.update(
        db,
        note,
        data,
    )


@router.delete(
    "/{note_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_note(
    project_id: int,
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = get_project_for_current_user(
        project_id,
        db,
        current_user,
    )

    note = note_service.get_project_note(
        db,
        note_id,
        project,
    )

    note_service.delete(db, note)

    return Response(
        status_code=status.HTTP_204_NO_CONTENT
    )