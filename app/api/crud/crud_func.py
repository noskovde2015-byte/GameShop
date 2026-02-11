from typing import List

from fastapi import HTTPException
from sqlalchemy import select, Result, func
from sqlalchemy.ext.asyncio import AsyncSession

from core.models import User, Item, Favorite
from core.shemas.ItemShema import ItemCreate, ItemUpdate, ItemSort
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
    sort: ItemSort | None = None,
):
    offset = (page - 1) * size

    total_stmt = select(func.count()).select_from(Item)
    total_result = await session.execute(total_stmt)
    total = total_result.scalar_one()

    stmt = select(Item)

    if sort == ItemSort.name_asc:
        stmt = stmt.order_by(Item.name.asc())
    elif sort == ItemSort.name_desc:
        stmt = stmt.order_by(Item.name.desc())
    elif sort == ItemSort.price_asc:
        stmt = stmt.order_by(Item.price.asc())
    elif sort == ItemSort.price_desc:
        stmt = stmt.order_by(Item.price.desc())
    else:
        stmt = stmt.order_by(Item.id)

    stmt = stmt.offset(offset).limit(size)

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


# --------------------------------------------------ИЗБРАННОЕ------------------------------------------------
async def add_to_favorites(session: AsyncSession, item: Item, user: User):
    favorite = Favorite(user_id=user.id, item_id=item.id)
    session.add(favorite)
    await session.commit()


async def remove_from_favorites(session: AsyncSession, item: Item, user: User):
    stmt = select(Favorite).where(
        Favorite.user_id == user.id, Favorite.item_id == item.id
    )
    result: Result = await session.execute(stmt)
    favorites = result.scalar_one_or_none()

    if favorites:
        await session.delete(favorites)
        await session.commit()


async def get_user_favorites(
    session: AsyncSession,
    user: User,
):
    stmt = (
        select(Item)
        .join(Favorite, Favorite.item_id == Item.id)
        .where(Favorite.user_id == user.id)
    )
    result: Result = await session.execute(stmt)
    favorites = result.scalars().all()
    return favorites
