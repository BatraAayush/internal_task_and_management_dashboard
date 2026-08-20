from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    status = Column(String(50), nullable=False, default="Pending", index=True)  # Pending, In Progress, Completed, Blocked
    priority = Column(String(50), nullable=False, default="Medium", index=True) # Low, Medium, High, Urgent
    assigned_to = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    due_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    assignee = relationship("User", back_populates="tasks")
    comments = relationship("Comment", back_populates="task", cascade="all, delete-orphan", order_by="Comment.created_at.desc()")