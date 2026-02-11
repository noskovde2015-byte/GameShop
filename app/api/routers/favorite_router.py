from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.status import HTTP_403_FORBIDDEN, HTTP_404_NOT_FOUND
from core.config import settings
from core.models import db_helper, User
from api.dependencies import get_current_user
from api.dependencies import require_seller
from api.crud.crud_func import (
    add_to_favorites,
    remove_from_favorites,
    get_user_favorites,
    get_item_by_id,
)
from core.shemas.ItemShema import ItemRead

router = APIRouter(prefix=settings.prefix.favorites, tags=["favorites"])


@router.post("/{item_id}")
async def add_to_favorites_endpoint(
    item_id: int,
    session: AsyncSession = Depends(db_helper.session_getter),
    user: User = Depends(get_current_user),
):
    item = await get_item_by_id(session, item_id)
    if not item:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail="Товар не найден",
        )
    await add_to_favorites(user=user, item=item, session=session)
    return {"message": "Товар добавлен в избранное"}


@router.delete("/{item_id}")
async def remove_from_favorites_endpoint(
    item_id: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_getter),
):
    item = await get_item_by_id(session, item_id)
    if not item:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Товар не найден")
    await remove_from_favorites(user=user, item=item, session=session)
    return {"message": "Товар убран из избранного"}


@router.get("", response_model=list[ItemRead])
async def get_favorites_endpoint(
    session: AsyncSession = Depends(db_helper.session_getter),
    user: User = Depends(get_current_user),
):
    return await get_user_favorites(session=session, user=user)
