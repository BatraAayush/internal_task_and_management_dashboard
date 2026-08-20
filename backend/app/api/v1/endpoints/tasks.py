from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.task_service import TaskService
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse, PaginatedTaskResponse

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.get("", response_model=PaginatedTaskResponse)
def get_tasks(
    status: Optional[str] = Query(None, description="Filter by status: Pending, In Progress, Completed, Blocked"),
    priority: Optional[str] = Query(None, description="Filter by priority: Low, Medium, High, Urgent"),
    assignee: Optional[int] = Query(None, description="Filter by User ID"),
    search: Optional[str] = Query(None, description="Search keyword in title or description"),
    sort_by: str = Query("created_at", description="Field to sort: created_at, due_date, priority, status, title"),
    sort_order: str = Query("desc", description="Sort direction: asc or desc"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
):
    return TaskService.list_tasks(
        db=db,
        status=status,
        priority=priority,
        assignee=assignee,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order,
        page=page,
        limit=limit,
    )


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(task_in: TaskCreate, db: Session = Depends(get_db)):
    return TaskService.create_task(db, task_in)


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db)):
    return TaskService.get_task(db, task_id)


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_update: TaskUpdate, db: Session = Depends(get_db)):
    return TaskService.update_task(db, task_id, task_update)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    TaskService.delete_task(db, task_id)
    return None