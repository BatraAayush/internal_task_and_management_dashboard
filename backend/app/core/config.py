import json
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Internal Task & Management API"
    API_V1_STR: str = "/api"
    DATABASE_URL: str = "sqlite:///./task_manager.db"
    CORS_ORIGINS: Union[List[str], str] = ["http://localhost:5173", "http://localhost:3000"]
    EXTERNAL_API_BASE_URL: str = "https://jsonplaceholder.typicode.com"

    @field_validator("CORS_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return [i.strip() for i in v.split(",")]
        return v

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)


settings = Settings()