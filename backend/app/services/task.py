from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.chapter import Chapter
from app.models.project import Project
from app.models.task import Task
from app.repositories.task import TaskRepository
from app.schemas.task import TaskCreate, TaskUpdate


class TaskService:
    def __init__(self):
        self.repository = TaskRepository()

    def _validate_chapter(
        self,
        db: Session,
        chapter_id: int | None,
        project: Project,
    ) -> None:
        if chapter_id is None:
            return

        chapter = db.get(Chapter, chapter_id)

        if chapter is None or chapter.project_id != project.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chapter not found in this project",
            )

    def create(
        self,
        db: Session,
        project: Project,
        data: TaskCreate,
    ) -> Task:
        self._validate_chapter(
            db,
            data.chapter_id,
            project,
        )

        task = Task(
            title=data.title,
            project_id=project.id,
            chapter_id=data.chapter_id,
        )

        return self.repository.create(db, task)

    def list_by_project(
        self,
        db: Session,
        project: Project,
    ) -> list[Task]:
        return self.repository.get_by_project(
            db,
            project.id,
        )

    def get_project_task(
        self,
        db: Session,
        task_id: int,
        project: Project,
    ) -> Task:
        task = self.repository.get_by_id(
            db,
            task_id,
        )

        if task is None or task.project_id != project.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found",
            )

        return task

    def update(
        self,
        db: Session,
        task: Task,
        project: Project,
        data: TaskUpdate,
    ) -> Task:
        update_data = data.model_dump(
            exclude_unset=True
        )

        if "chapter_id" in update_data:
            self._validate_chapter(
                db,
                update_data["chapter_id"],
                project,
            )

        for field, value in update_data.items():
            setattr(task, field, value)

        db.commit()
        db.refresh(task)

        return task

    def delete(
        self,
        db: Session,
        task: Task,
    ) -> None:
        self.repository.delete(db, task)