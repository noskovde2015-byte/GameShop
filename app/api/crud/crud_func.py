from sqlalchemy import select, Result
from sqlalchemy.ext.asyncio import AsyncSession

from core.models import User
from core.shemas.UserShema import UserCreate


async def get_users(session):
    stmt = select(User).order_by(User.id)
    result: Result = await session.execute(stmt)
    users = result.scalars().all()
    return users


async def create_user(user_data: UserCreate, session: AsyncSession):
    new_user = User(**user_data.model_dump())
    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)
    return new_user
