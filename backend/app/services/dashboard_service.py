from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session
from app.models.task import Task
from app.schemas.dashboard import DashboardMetrics


class DashboardService:
    @staticmethod
    def get_metrics(db: Session, current_user_id: Optional[int] = None) -> DashboardMetrics:
        now = datetime.utcnow()

        total = db.query(Task).count()
        pending = db.query(Task).filter(Task.status == "Pending").count()
        in_progress = db.query(Task).filter(Task.status == "In Progress").count()
        completed = db.query(Task).filter(Task.status == "Completed").count()
        blocked = db.query(Task).filter(Task.status == "Blocked").count()

        overdue = (
            db.query(Task)
            .filter(Task.due_date < now, Task.status != "Completed")
            .count()
        )

        my_tasks_count = 0
        if current_user_id:
            my_tasks_count = (
                db.query(Task)
                .filter(Task.assigned_to == current_user_id, Task.status != "Completed")
                .count()
            )

        return DashboardMetrics(
            total_tasks=total,
            pending_tasks=pending,
            in_progress_tasks=in_progress,
            completed_tasks=completed,
            blocked_tasks=blocked,
            overdue_tasks=overdue,
            my_tasks_count=my_tasks_count,
        )