from datetime import date

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.daily_writing_stat import DailyWritingStat


class DailyWritingService:
    def record_words(
        self,
        db: Session,
        project_id: int,
        words_written: int,
    ) -> None:
        if words_written <= 0:
            return

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