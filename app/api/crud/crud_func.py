from typing import List

from fastapi import HTTPException
from sqlalchemy import select, Result
from sqlalchemy.ext.asyncio import AsyncSession

from core.models import User, Item
from core.shemas.ItemShema import ItemCreate, ItemUpdate
from core.shemas.UserShema import UserCreate


# -----------------------------------РАБОТА С ПОЛЬЗОВАТЕЛЯМИ----------------------------------------
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


# -----------------------------------РАБОТА С ТОВАРАМИ------------------------------------------------
async def create_item(
    session: AsyncSession, item_data: ItemCreate, seller: User
) -> Item:
    new_item = Item(**item_data.model_dump(), seller_id=seller.id)
    session.add(new_item)
    await session.commit()
    await session.refresh(new_item)
    return new_item


async def get_items(session: AsyncSession) -> list[Item]:
    stmt = select(Item).order_by(Item.id)
    result: Result = await session.execute(stmt)
    items = result.scalars().all()
    return list(items)


async def get_item_by_id(session: AsyncSession, item_id: int) -> Item | None:
    stmt = select(Item).where(Item.id == item_id)
    result: Result = await session.execute(stmt)
    item = result.scalar_one_or_none()
    return item


async def update_item(
    session: AsyncSession,
    item: Item,
    item_data: ItemUpdate,
) -> Item:
    for field, value in item_data.model_dump(exclude_unset=True).items():
        setattr(item, field, value)

    await session.commit()
    await session.refresh(item)
    return item


async def delete_item(session: AsyncSession, item: Item) -> None:
    await session.delete(item)
    await session.commit()
