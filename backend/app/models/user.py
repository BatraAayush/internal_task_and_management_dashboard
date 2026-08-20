from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    role = Column(String(50), nullable=False, default="Developer")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    tasks = relationship("Task", back_populates="assignee", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="author", cascade="all, delete-orphan")