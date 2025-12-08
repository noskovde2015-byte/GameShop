from fastapi import APIRouter
from core.config import settings
from api.routers.user_router import router as user_router

router = APIRouter(prefix=settings.prefix.api_prefix)
router.include_router(user_router)
