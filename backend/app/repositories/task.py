from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.task import Task


class TaskRepository:
    def create(
        self,
        db: Session,
        task: Task,
    ) -> Task:
        db.add(task)
        db.commit()
        db.refresh(task)

        return task

    def get_by_id(
        self,
        db: Session,
        task_id: int,
    ) -> Task | None:
        return db.get(Task, task_id)

    def get_by_project(
        self,
        db: Session,
        project_id: int,
    ) -> list[Task]:
        statement = (
            select(Task)
            .where(Task.project_id == project_id)
            .order_by(Task.completed, Task.id.desc())
        )

        return list(db.scalars(statement))

    def delete(
        self,
        db: Session,
        task: Task,
    ) -> None:
        db.delete(task)
        db.commit()