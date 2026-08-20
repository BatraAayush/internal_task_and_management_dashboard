from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.schemas.user import UserResponse


class CommentBase(BaseModel):
    comment: str


class CommentCreate(CommentBase):
    user_id: int


class CommentResponse(CommentBase):
    id: int
    task_id: int
    user_id: int
    created_at: datetime
    author: UserResponse | None = None

    model_config = ConfigDict(from_attributes=True)