from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.services.daily_writing import DailyWritingService
from app.services.project import ProjectService

router = APIRouter(
    prefix="/projects/{project_id}/writing",
    tags=["Writing"],
)

daily_writing_service = DailyWritingService()
project_service = ProjectService()


@router.get("/history")
def get_writing_history(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = project_service.get_owned_project(
        db,
        project_id,
        current_user,
    )

    return daily_writing_service.list_by_project(
        db,
        project.id,
    )