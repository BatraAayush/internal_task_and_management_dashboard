from pydantic import BaseModel


class DashboardMetrics(BaseModel):
    total_tasks: int
    pending_tasks: int
    in_progress_tasks: int
    completed_tasks: int
    blocked_tasks: int
    overdue_tasks: int
    my_tasks_count: int