from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.status import HTTP_403_FORBIDDEN, HTTP_404_NOT_FOUND
from core.config import settings
from core.models import db_helper, User
from core.shemas.ItemShema import ItemCreate, ItemUpdate, ItemRead
from api.dependencies import get_current_user
from api.dependencies import require_seller

from api.crud.crud_func import (
    create_item,
    get_items,
    get_item_by_id,
    update_item,
    delete_item,
)

router = APIRouter(prefix=settings.prefix.items, tags=["Items"])


@router.post("", response_model=ItemRead)
async def create_item_endpoint(
    item_data: ItemCreate,
    session: AsyncSession = Depends(db_helper.session_getter),
    seller: User = Depends(require_seller),
):
    return await create_item(
        item_data=item_data,
        session=session,
        seller=seller,
    )


@router.get("", response_model=list[ItemRead])
async def get_items_endpoint(session: AsyncSession = Depends(db_helper.session_getter)):
    return await get_items(session=session)


@router.patch("/{item_id}", response_model=ItemRead)
async def update_item_endpoint(
    item_id: int,
    item_data: ItemUpdate,
    session: AsyncSession = Depends(db_helper.session_getter),
    seller: User = Depends(require_seller),
):
    item = await get_item_by_id(item_id=item_id, session=session)

    if not item:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Товар не найден")

    if item.seller_id != seller.id:
        raise HTTPException(HTTP_403_FORBIDDEN, "Вы не можете изменить данный товар")

    return await update_item(
        item_data=item_data,
        session=session,
        item=item,
    )


@router.delete("/{item_id}")
async def delete_item_endpoint(
    item_id: int,
    session: AsyncSession = Depends(db_helper.session_getter),
    seller: User = Depends(require_seller),
):
    item = await get_item_by_id(item_id=item_id, session=session)

    if not item:
        raise HTTPException(HTTP_404_NOT_FOUND, detail="Товар не найден")

    if item.seller_id != seller.id:
        raise HTTPException(HTTP_403_FORBIDDEN, "Вы не можете удалить данный товар")

    await delete_item(session=session, item=item)
    return {"message": "Предмет удален успешно"}
