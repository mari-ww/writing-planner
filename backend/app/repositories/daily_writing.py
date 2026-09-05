from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.daily_writing_stat import DailyWritingStat


class DailyWritingRepository:
    def get_by_project(
        self,
        db: Session,
        project_id: int,
    ) -> list[DailyWritingStat]:
        statement = (
            select(DailyWritingStat)
            .where(DailyWritingStat.project_id == project_id)
            .order_by(DailyWritingStat.date)
        )

        return list(db.scalars(statement).all())