from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.project import Project
from app.models.user import User
from app.repositories.project import ProjectRepository
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
)


class ProjectService:
    def __init__(self):
        self.repository = ProjectRepository()

    def create(
        self,
        db: Session,
        user: User,
        data: ProjectCreate,
    ) -> Project:
        project = Project(
            **data.model_dump(),
            user_id=user.id,
        )

        return self.repository.create(db, project)

    def list_by_user(
        self,
        db: Session,
        user: User,
    ) -> list[Project]:
        return self.repository.get_by_user(
            db,
            user.id,
        )

    def get_owned_project(
        self,
        db: Session,
        project_id: int,
        user: User,
    ) -> Project:
        project = self.repository.get_by_id(
            db,
            project_id,
        )

        if project is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found",
            )

        if project.user_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have access to this project",
            )

        return project

    def update(
        self,
        db: Session,
        project: Project,
        data: ProjectUpdate,
    ) -> Project:
        update_data = data.model_dump(
            exclude_unset=True
        )

        for field, value in update_data.items():
            setattr(project, field, value)

        db.commit()
        db.refresh(project)

        return project

    def delete(
        self,
        db: Session,
        project: Project,
    ) -> None:
        self.repository.delete(db, project)