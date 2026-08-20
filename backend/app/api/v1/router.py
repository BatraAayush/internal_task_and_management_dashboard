from fastapi import APIRouter
from app.api.v1.endpoints import users, tasks, comments, dashboard, external

api_router = APIRouter()
api_router.include_router(users.router)
api_router.include_router(tasks.router)
api_router.include_router(comments.router)
api_router.include_router(dashboard.router)
api_router.include_router(external.router)