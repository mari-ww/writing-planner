from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.chapter import (
    ChapterCreate,
    ChapterResponse,
    ChapterUpdate,
)
from app.services.chapter import ChapterService
from app.services.project import ProjectService


router = APIRouter(
    prefix="/projects/{project_id}/chapters",
    tags=["Chapters"],
)

chapter_service = ChapterService()
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
    response_model=ChapterResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_chapter(
    project_id: int,
    data: ChapterCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = get_project_for_current_user(
        project_id,
        db,
        current_user,
    )

    return chapter_service.create(
        db,
        project,
        data,
    )


@router.get(
    "",
    response_model=list[ChapterResponse],
)
def list_chapters(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = get_project_for_current_user(
        project_id,
        db,
        current_user,
    )

    return chapter_service.list_by_project(
        db,
        project,
    )


@router.get(
    "/{chapter_id}",
    response_model=ChapterResponse,
)
def get_chapter(
    project_id: int,
    chapter_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = get_project_for_current_user(
        project_id,
        db,
        current_user,
    )

    return chapter_service.get_owned_chapter(
        db,
        chapter_id,
        project,
    )


@router.patch(
    "/{chapter_id}",
    response_model=ChapterResponse,
)
def update_chapter(
    project_id: int,
    chapter_id: int,
    data: ChapterUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = get_project_for_current_user(
        project_id,
        db,
        current_user,
    )

    chapter = chapter_service.get_owned_chapter(
        db,
        chapter_id,
        project,
    )

    return chapter_service.update(
        db,
        chapter,
        data,
    )


@router.delete(
    "/{chapter_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_chapter(
    project_id: int,
    chapter_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = get_project_for_current_user(
        project_id,
        db,
        current_user,
    )

    chapter = chapter_service.get_owned_chapter(
        db,
        chapter_id,
        project,
    )

    chapter_service.delete(db, chapter)

    return Response(
        status_code=status.HTTP_204_NO_CONTENT
    )