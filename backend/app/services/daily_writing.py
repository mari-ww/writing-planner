from sqlalchemy.orm import Session

from app.models.daily_writing_stat import DailyWritingStat
from app.repositories.daily_writing import DailyWritingRepository
from app.schemas.daily_writing import DailyWritingStatResponse


class DailyWritingService:
    def __init__(self):
        self.repository = DailyWritingRepository()

    def record_words(
        self,
        db: Session,
        project_id: int,
        words_written: int,
    ) -> None:
        if words_written <= 0:
            return

        from datetime import date
        from sqlalchemy import select

        today = date.today()

        stat = db.scalar(
            select(DailyWritingStat).where(
                DailyWritingStat.project_id == project_id,
                DailyWritingStat.date == today,
            )
        )

        if stat is None:
            stat = DailyWritingStat(
                project_id=project_id,
                date=today,
                words_written=words_written,
            )
            db.add(stat)
        else:
            stat.words_written += words_written

        db.commit()

    def list_by_project(
        self,
        db: Session,
        project_id: int,
    ) -> list[DailyWritingStatResponse]:
        stats = self.repository.get_by_project(db, project_id)

        return [
            DailyWritingStatResponse.model_validate(stat)
            for stat in stats
        ]