from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.user import UserResponse
from app.schemas.comment import CommentResponse


class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    status: str = Field(default="Pending", pattern="^(Pending|In Progress|Completed|Blocked)$")
    priority: str = Field(default="Medium", pattern="^(Low|Medium|High|Urgent)$")
    assigned_to: Optional[int] = None
    due_date: Optional[datetime] = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(Pending|In Progress|Completed|Blocked)$")
    priority: Optional[str] = Field(None, pattern="^(Low|Medium|High|Urgent)$")
    assigned_to: Optional[int] = None
    due_date: Optional[datetime] = None


class TaskResponse(TaskBase):
    id: int
    created_at: datetime
    updated_at: datetime
    assignee: Optional[UserResponse] = None
    comments: List[CommentResponse] = []

    model_config = ConfigDict(from_attributes=True)


class PaginatedTaskResponse(BaseModel):
    total: int
    page: int
    limit: int
    total_pages: int
    items: List[TaskResponse]