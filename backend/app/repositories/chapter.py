from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.chapter import Chapter


class ChapterRepository:
    def create(
        self,
        db: Session,
        chapter: Chapter,
    ) -> Chapter:
        db.add(chapter)
        db.commit()
        db.refresh(chapter)

        return chapter

    def get_by_id(
        self,
        db: Session,
        chapter_id: int,
    ) -> Chapter | None:
        return db.get(Chapter, chapter_id)

    def get_by_project(
        self,
        db: Session,
        project_id: int,
    ) -> list[Chapter]:
        statement = (
            select(Chapter)
            .where(Chapter.project_id == project_id)
            .order_by(Chapter.position)
        )

        return list(db.scalars(statement))

    def get_next_position(
        self,
        db: Session,
        project_id: int,
    ) -> int:
        chapters = self.get_by_project(
            db,
            project_id,
        )

        return len(chapters) + 1

    def delete(
        self,
        db: Session,
        chapter: Chapter,
    ) -> None:
        db.delete(chapter)
        db.commit()