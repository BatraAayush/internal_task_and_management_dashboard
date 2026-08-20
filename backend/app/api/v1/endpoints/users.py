from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate, UserResponse

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db)):
    return UserRepository.get_all(db)


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = UserRepository.get_by_email(db, user_in.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists"
        )
    return UserRepository.create(db, user_in)