from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from core.models import db_helper, User
from core.config import settings
from core.models.user import UserRole
from core.shemas.UserShema import UserRead, UserCreate
from api.crud.crud_func import get_users, create_user
from api.dependencies import get_current_user


router = APIRouter(prefix=settings.prefix.users, tags=["Users"])


# Выдача всех пользователей
@router.get("", response_model=list[UserRead])
async def get_all_users(session: AsyncSession = Depends(db_helper.session_getter)):
    return await get_users(
        session=session,
    )


# Временный роутер для тестов
@router.post("", response_model=UserCreate)
async def create_new_user(
    user_data: UserCreate, session: AsyncSession = Depends(db_helper.session_getter)
):
    return await create_user(
        session=session,
        user_data=user_data,
    )


@router.get("/me", response_model=UserRead)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user


# Смена роли с покупателя на продавца
@router.post("/become-seller")
async def become_seller(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_getter),
):
    if current_user.role == UserRole.SELLER:
        return {"message": "Пользователь уже является продавцом"}

    current_user.role = UserRole.SELLER
    await session.commit()
    await session.refresh(current_user)
    return {"message": "Поздравляем! Вы успешно стали продавцом"}
