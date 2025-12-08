from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from core.models import db_helper
from core.config import settings
from core.shemas.UserShema import UserRead, UserCreate
from api.crud.crud_func import get_users, create_user


router = APIRouter(prefix=settings.prefix.users, tags=["Users"])


@router.get("", response_model=list[UserRead])
async def get_all_users(session: AsyncSession = Depends(db_helper.session_getter)):
    return await get_users(
        session=session,
    )


@router.post("", response_model=UserCreate)
async def create_new_user(
    user_data: UserCreate, session: AsyncSession = Depends(db_helper.session_getter)
):
    return await create_user(
        session=session,
        user_data=user_data,
    )
