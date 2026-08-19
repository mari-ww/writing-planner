from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.task import (
    TaskCreate,
    TaskResponse,
    TaskUpdate,
)
from app.services.project import ProjectService
from app.services.task import TaskService


router = APIRouter(
    prefix="/projects/{project_id}/tasks",
    tags=["Tasks"],
)

task_service = TaskService()
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
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_task(
    project_id: int,
    data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = get_project_for_current_user(
        project_id,
        db,
        current_user,
    )

    return task_service.create(
        db,
        project,
        data,
    )


@router.get(
    "",
    response_model=list[TaskResponse],
)
def list_tasks(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = get_project_for_current_user(
        project_id,
        db,
        current_user,
    )

    return task_service.list_by_project(
        db,
        project,
    )


@router.get(
    "/{task_id}",
    response_model=TaskResponse,
)
def get_task(
    project_id: int,
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = get_project_for_current_user(
        project_id,
        db,
        current_user,
    )

    return task_service.get_project_task(
        db,
        task_id,
        project,
    )


@router.patch(
    "/{task_id}",
    response_model=TaskResponse,
)
def update_task(
    project_id: int,
    task_id: int,
    data: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = get_project_for_current_user(
        project_id,
        db,
        current_user,
    )

    task = task_service.get_project_task(
        db,
        task_id,
        project,
    )

    return task_service.update(
        db,
        task,
        project,
        data,
    )


@router.delete(
    "/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_task(
    project_id: int,
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = get_project_for_current_user(
        project_id,
        db,
        current_user,
    )

    task = task_service.get_project_task(
        db,
        task_id,
        project,
    )

    task_service.delete(db, task)

    return Response(
        status_code=status.HTTP_204_NO_CONTENT
    )