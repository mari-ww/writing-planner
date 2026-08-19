from sqlalchemy.orm import Session

from app.models.project import Project
from app.models.user import User
from app.repositories.chapter import ChapterRepository
from app.schemas.statistics import (
    ChapterWritingStat,
    ProjectStatisticsResponse,
)
from app.services.writing import count_words


class StatisticsService:
    def __init__(self):
        self.chapter_repository = ChapterRepository()

    def get_project_statistics(
        self,
        db: Session,
        project: Project,
        user: User,
    ) -> ProjectStatisticsResponse:
        chapters = self.chapter_repository.get_by_project(
            db,
            project.id,
        )

        chapter_stats = [
            ChapterWritingStat(
                chapter_id=chapter.id,
                title=chapter.title,
                word_count=count_words(chapter.content),
            )
            for chapter in chapters
        ]

        total_words = sum(
            chapter.word_count
            for chapter in chapter_stats
        )

        chapter_count = len(chapter_stats)

        average_words_per_chapter = (
            total_words / chapter_count
            if chapter_count > 0
            else 0
        )

        daily_word_goal = user.daily_word_goal

        daily_word_progress = min(
            total_words,
            daily_word_goal,
        )

        daily_goal_percentage = min(
            (total_words / daily_word_goal) * 100,
            100,
        )

        return ProjectStatisticsResponse(
            total_words=total_words,
            chapter_count=chapter_count,
            average_words_per_chapter=round(
                average_words_per_chapter,
                2,
            ),
            daily_word_goal=daily_word_goal,
            daily_word_progress=daily_word_progress,
            daily_goal_percentage=round(
                daily_goal_percentage,
                2,
            ),
            chapters=chapter_stats,
        )