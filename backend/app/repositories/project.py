from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.project import Project


class ProjectRepository:
    def create(
        self,
        db: Session,
        project: Project,
    ) -> Project:
        db.add(project)
        db.commit()
        db.refresh(project)

        return project

    def get_by_id(
        self,
        db: Session,
        project_id: int,
    ) -> Project | None:
        return db.get(Project, project_id)

    def get_by_user(
        self,
        db: Session,
        user_id: int,
    ) -> list[Project]:
        statement = (
            select(Project)
            .where(Project.user_id == user_id)
            .order_by(Project.id.desc())
        )

        return list(db.scalars(statement))

    def delete(
        self,
        db: Session,
        project: Project,
    ) -> None:
        db.delete(project)
        db.commit()