from typing import List

from fastapi import HTTPException
from sqlalchemy import select, Result, func
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


async def search_by_name(session: AsyncSession, name: str) -> list[Item]:
    stmt = select(Item).where(Item.name.like(f"%{name}%"))
    result: Result = await session.execute(stmt)
    items = result.scalars().all()
    return list(items)


# ---------------------------------------------ПАГИНАЦИЯ-----------------------------------------
async def get_items_paginated(
    session: AsyncSession,
    page: int,
    size: int,
):
    if page < 1:
        page = 1

    if size < 1:
        size = 10

    # Пропуск элементов
    offset = (page - 1) * size

    # Общее количество товаров
    total_stmt = select(func.count()).select_from(Item)
    total_result: Result = await session.execute(total_stmt)
    total = total_result.scalar_one()

    stmt = select(Item).order_by(Item.id).offset(offset).limit(size)

    result: Result = await session.execute(stmt)
    items = result.scalars().all()

    pages = (total + size - 1) // size

    return {
        "meta": {
            "page": page,
            "size": size,
            "total": total,
            "pages": pages,
        },
        "items": items,
    }
