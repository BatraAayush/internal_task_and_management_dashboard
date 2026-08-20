from typing import Optional
from fastapi import Header
from app.core.database import get_db

# Simulates current active user header context for internal dashboard operations
def get_current_user_id(x_user_id: Optional[int] = Header(default=1, alias="X-User-ID")) -> int:
    return x_user_id or 1