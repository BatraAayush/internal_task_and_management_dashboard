import math
from datetime import datetime
from typing import Optional, Tuple, List
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, desc, asc
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate


class TaskRepository:
    @staticmethod
    def get_all_paginated(
        db: Session,
        status: Optional[str] = None,
        priority: Optional[str] = None,
        assignee: Optional[int] = None,
        search: Optional[str] = None,
        sort_by: str = "created_at",
        sort_order: str = "desc",
        page: int = 1,
        limit: int = 10,
    ) -> Tuple[List[Task], int, int]:
        query = db.query(Task).options(
            joinedload(Task.assignee),
            joinedload(Task.comments)
        )

        # Filters
        if status:
            query = query.filter(Task.status == status)
        if priority:
            query = query.filter(Task.priority == priority)
        if assignee:
            query = query.filter(Task.assigned_to == assignee)

        # Full text search across title and description
        if search:
            search_query = f"%{search.strip()}%"
            query = query.filter(
                or_(
                    Task.title.ilike(search_query),
                    Task.description.ilike(search_query)
                )
            )

        # Sorting
        valid_sort_fields = {
            "title": Task.title,
            "status": Task.status,
            "priority": Task.priority,
            "due_date": Task.due_date,
            "created_at": Task.created_at,
            "updated_at": Task.updated_at
        }
        sort_column = valid_sort_fields.get(sort_by, Task.created_at)
        query = query.order_by(desc(sort_column) if sort_order.lower() == "desc" else asc(sort_column))

        # Pagination calculations
        total_count = query.count()
        total_pages = math.ceil(total_count / limit) if total_count > 0 else 1
        items = query.offset((page - 1) * limit).limit(limit).all()

        return items, total_count, total_pages

    @staticmethod
    def get_by_id(db: Session, task_id: int) -> Optional[Task]:
        return db.query(Task).options(
            joinedload(Task.assignee),
            joinedload(Task.comments)
        ).filter(Task.id == task_id).first()

    @staticmethod
    def create(db: Session, task_data: TaskCreate) -> Task:
        db_task = Task(**task_data.model_dump())
        db.add(db_task)
        db.commit()
        db.refresh(db_task)
        return db_task

    @staticmethod
    def update(db: Session, task_id: int, updates: TaskUpdate) -> Optional[Task]:
        task = TaskRepository.get_by_id(db, task_id)
        if not task:
            return None

        update_fields = updates.model_dump(exclude_unset=True)
        for field, value in update_fields.items():
            setattr(task, field, value)

        task.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(task)
        return task

    @staticmethod
    def delete(db: Session, task_id: int) -> bool:
        task = db.query(Task).filter(Task.id == task_id).first()
        if not task:
            return False
        db.delete(task)
        db.commit()
        return True