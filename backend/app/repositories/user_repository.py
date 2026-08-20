from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate


class UserRepository:
    @staticmethod
    def get_all(db: Session) -> List[User]:
        return db.query(User).order_by(User.name.asc()).all()

    @staticmethod
    def get_by_id(db: Session, user_id: int) -> Optional[User]:
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def get_by_email(db: Session, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def create(db: Session, user_data: UserCreate) -> User:
        db_user = User(**user_data.model_dump())
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user