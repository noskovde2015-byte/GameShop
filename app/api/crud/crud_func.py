from sqlalchemy import select, Result
from core.models import User


async def get_users(session):
    stmt = select(User).order_by(User.id)
    result: Result = await session.execute(stmt)
    users = result.scalars().all()
    return users
