from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories.task_repository import TaskRepository
from app.repositories.user_repository import UserRepository
from app.schemas.task import TaskCreate, TaskUpdate, PaginatedTaskResponse, TaskResponse


class TaskService:
    @staticmethod
    def list_tasks(
        db: Session,
        status: Optional[str] = None,
        priority: Optional[str] = None,
        assignee: Optional[int] = None,
        search: Optional[str] = None,
        sort_by: str = "created_at",
        sort_order: str = "desc",
        page: int = 1,
        limit: int = 10,
    ) -> PaginatedTaskResponse:
        items, total, total_pages = TaskRepository.get_all_paginated(
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
        return PaginatedTaskResponse(
            total=total,
            page=page,
            limit=limit,
            total_pages=total_pages,
            items=[TaskResponse.model_validate(t) for t in items]
        )

    @staticmethod
    def get_task(db: Session, task_id: int) -> TaskResponse:
        task = TaskRepository.get_by_id(db, task_id)
        if not task:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Task with id {task_id} not found")
        return TaskResponse.model_validate(task)

    @staticmethod
    def create_task(db: Session, task_data: TaskCreate) -> TaskResponse:
        if task_data.assigned_to:
            user = UserRepository.get_by_id(db, task_data.assigned_to)
            if not user:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Assigned user does not exist")
        created = TaskRepository.create(db, task_data)
        return TaskService.get_task(db, created.id)

    @staticmethod
    def update_task(db: Session, task_id: int, updates: TaskUpdate) -> TaskResponse:
        if updates.assigned_to:
            user = UserRepository.get_by_id(db, updates.assigned_to)
            if not user:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Assigned user does not exist")
        updated = TaskRepository.update(db, task_id, updates)
        if not updated:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Task with id {task_id} not found")
        return TaskService.get_task(db, updated.id)

    @staticmethod
    def delete_task(db: Session, task_id: int) -> None:
        deleted = TaskRepository.delete(db, task_id)
        if not deleted:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Task with id {task_id} not found")