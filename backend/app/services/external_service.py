import httpx
from fastapi import HTTPException, status
from app.core.config import settings


class ExternalAPIService:
    @staticmethod
    async def fetch_external_team_members():
        url = f"{settings.EXTERNAL_API_BASE_URL}/users"
        timeout = httpx.Timeout(8.0, connect=3.0)

        async with httpx.AsyncClient(timeout=timeout) as client:
            try:
                response = await client.get(url)
                response.raise_for_status()
                data = response.json()
                
                # Transform external API response to a clean structure
                return [
                    {
                        "id": user.get("id"),
                        "name": user.get("name"),
                        "username": user.get("username"),
                        "email": user.get("email"),
                        "phone": user.get("phone"),
                        "website": user.get("website"),
                        "company_name": user.get("company", {}).get("name", "N/A"),
                        "city": user.get("address", {}).get("city", "N/A"),
                    }
                    for user in data
                ]
            except httpx.TimeoutException:
                raise HTTPException(
                    status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                    detail="External directory service timed out. Please try again."
                )
            except httpx.HTTPStatusError as exc:
                raise HTTPException(
                    status_code=exc.response.status_code,
                    detail="External directory service returned an error."
                )
            except httpx.RequestError as exc:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail=f"Unable to connect to external directory service: {str(exc)}"
                )