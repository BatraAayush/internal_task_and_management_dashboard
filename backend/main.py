from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
import app.models  # Registers all SQLAlchemy models
from app.api.v1.router import api_router

# Create all database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Internal Task & Management API built with FastAPI, SQLAlchemy, and SQLite.",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register main API router under /api
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "service": settings.PROJECT_NAME}