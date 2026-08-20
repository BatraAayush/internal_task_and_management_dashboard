from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user_id
from app.services.dashboard_service import DashboardService
from app.schemas.dashboard import DashboardMetrics

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("", response_model=DashboardMetrics)
def get_dashboard_metrics(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return DashboardService.get_metrics(db, current_user_id=current_user_id)