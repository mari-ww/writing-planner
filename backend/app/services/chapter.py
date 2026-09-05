from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.chapter import Chapter
from app.models.project import Project
from app.repositories.chapter import ChapterRepository
from app.schemas.chapter import (
    ChapterCreate,
    ChapterResponse,
    ChapterUpdate,
)
from app.services.daily_writing import DailyWritingService
from app.services.writing import count_words


class ChapterService:
    def __init__(self):
        self.repository = ChapterRepository()
        self.daily_writing_service = DailyWritingService()

    def to_response(self, chapter: Chapter) -> ChapterResponse:
        return ChapterResponse(
            id=chapter.id,
            title=chapter.title,
            content=chapter.content,
            position=chapter.position,
            project_id=chapter.project_id,
            word_count=count_words(chapter.content),
        )

    def create(
        self,
        db: Session,
        project: Project,
        data: ChapterCreate,
    ) -> ChapterResponse:
        position = self.repository.get_next_position(db, project.id)

        chapter = Chapter(
            title=data.title,
            content=data.content,
            position=position,
            project_id=project.id,
        )

        chapter = self.repository.create(db, chapter)

        return self.to_response(chapter)

    def list_by_project(
        self,
        db: Session,
        project: Project,
    ) -> list[ChapterResponse]:
        chapters = self.repository.get_by_project(db, project.id)

        return [
            self.to_response(chapter)
            for chapter in chapters
        ]

    def get_owned_chapter(
        self,
        db: Session,
        chapter_id: int,
        project: Project,
    ) -> Chapter:
        chapter = self.repository.get_by_id(db, chapter_id)

        if chapter is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chapter not found",
            )

        if chapter.project_id != project.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chapter not found in this project",
            )

        return chapter

    def update(
        self,
        db: Session,
        chapter: Chapter,
        data: ChapterUpdate,
    ) -> ChapterResponse:
        old_word_count = count_words(chapter.content)

        update_data = data.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(chapter, field, value)

        new_word_count = count_words(chapter.content)
        words_added = new_word_count - old_word_count

        db.commit()
        db.refresh(chapter)

        self.daily_writing_service.record_words(
            db,
            chapter.project_id,
            words_added,
        )

        return self.to_response(chapter)

    def delete(
        self,
        db: Session,
        chapter: Chapter,
    ) -> None:
        self.repository.delete(db, chapter)