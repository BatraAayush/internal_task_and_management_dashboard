from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.repositories.comment_repository import CommentRepository
from app.repositories.task_repository import TaskRepository
from app.repositories.user_repository import UserRepository
from app.schemas.comment import CommentCreate, CommentResponse

router = APIRouter(prefix="/tasks/{task_id}/comments", tags=["Comments"])


@router.get("", response_model=List[CommentResponse])
def get_comments(task_id: int, db: Session = Depends(get_db)):
    task = TaskRepository.get_by_id(db, task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return CommentRepository.get_by_task_id(db, task_id)


@router.post("", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def add_comment(task_id: int, comment_in: CommentCreate, db: Session = Depends(get_db)):
    task = TaskRepository.get_by_id(db, task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    user = UserRepository.get_by_id(db, comment_in.user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Author user not found")

    created = CommentRepository.create(db, task_id, comment_in)
    return CommentResponse.model_validate(created)