from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from app.models.comment import Comment
from app.schemas.comment import CommentCreate


class CommentRepository:
    @staticmethod
    def get_by_task_id(db: Session, task_id: int) -> List[Comment]:
        return (
            db.query(Comment)
            .options(joinedload(Comment.author))
            .filter(Comment.task_id == task_id)
            .order_by(Comment.created_at.desc())
            .all()
        )

    @staticmethod
    def create(db: Session, task_id: int, comment_data: CommentCreate) -> Comment:
        db_comment = Comment(
            task_id=task_id,
            user_id=comment_data.user_id,
            comment=comment_data.comment
        )
        db.add(db_comment)
        db.commit()
        db.refresh(db_comment)
        return db_comment