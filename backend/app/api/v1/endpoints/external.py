from fastapi import APIRouter
from app.services.external_service import ExternalAPIService

router = APIRouter(prefix="/external", tags=["External Integration"])


@router.get("/users")
async def get_external_directory():
    """
    Fetches partner team members from public JSONPlaceholder API.
    Includes error handling, gateway timeouts, and response mapping.
    """
    return await ExternalAPIService.fetch_external_team_members()