from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.statistics import ProjectStatisticsResponse
from app.services.project import ProjectService
from app.services.statistics import StatisticsService


router = APIRouter(
    prefix="/projects/{project_id}/statistics",
    tags=["Statistics"],
)

project_service = ProjectService()
statistics_service = StatisticsService()


@router.get(
    "",
    response_model=ProjectStatisticsResponse,
)
def get_project_statistics(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = project_service.get_owned_project(
        db,
        project_id,
        current_user,
    )

    return statistics_service.get_project_statistics(
        db,
        project,
        current_user,
    )