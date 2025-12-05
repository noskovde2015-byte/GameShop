from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from core.models import db_helper
from core.config import settings
from core.shemas.UserShema import UserRead
from api.crud.crud_func import get_users


router = APIRouter(prefix=settings.prefix.users, tags=["Users"])


@router.get("", response_model=list[UserRead])
async def get_all_users(session: AsyncSession = Depends(db_helper.session_getter)):
    return await get_users(
        session=session,
    )
