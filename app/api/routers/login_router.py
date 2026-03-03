from fastapi import APIRouter, Depends, Response, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status
from sqlalchemy import select
from datetime import timedelta, datetime, timezone
from api.dependencies import get_current_user
from core.models import db_helper, User, RefreshToken
from core.config import settings
from core.shemas.UserShema import UserAuth
from core.auth import (
    authenticate_user,
    create_access_token,
    create_refresh_token,
    hash_refresh_token,
)

router = APIRouter(prefix=settings.prefix.login, tags=["Auth"])


@router.post("")
async def login(
    user_data: UserAuth,
    response: Response,
    session: AsyncSession = Depends(db_helper.session_getter),
):
    check = await authenticate_user(
        email=user_data.email, password=user_data.password, session=session
    )

    if check is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    # Access
    access_token = create_access_token({"sub": str(check.id)})

    # Refresh
    refresh_token = create_refresh_token()
    refresh_hash = hash_refresh_token(refresh_token)
    refresh_expires = datetime.utcnow() + timedelta(
        days=settings.auth.REFRESH_TOKEN_EXPIRE
    )

    # Рефреш для бд
    db_refresh = RefreshToken(
        token_hash=refresh_hash,
        user_id=check.id,
        expires_at=refresh_expires,
    )
    session.add(db_refresh)
    await session.commit()

    # Кладем в куки
    response.set_cookie(key="user_access_token", value=access_token, httponly=True)
    response.set_cookie(key="user_refresh_token", value=refresh_token, httponly=True)
    return {"access_token": access_token}


@router.post("/refresh")
async def refresh_token(
    request: Request,
    response: Response,
    session: AsyncSession = Depends(db_helper.session_getter),
):
    refresh_token = request.cookies.get("user_refresh_token")

    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Нет рефреш токена"
        )

    hashed = hash_refresh_token(refresh_token)
    stmt = select(RefreshToken).where(RefreshToken.token_hash == hashed)
    result = await session.execute(stmt)
    db_token = result.scalars().one_or_none()

    if not db_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Неверный формат токена"
        )

    if db_token.expires_at < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Срок действия токена истек",
        )

    # Удаляем старый токен
    user_id = db_token.user_id
    await session.delete(db_token)
    await session.commit()

    # Создаем новый
    new_refresh = create_refresh_token()
    new_hash = hash_refresh_token(new_refresh)

    new_db_token = RefreshToken(
        token_hash=new_hash,
        user_id=user_id,
        expires_at=datetime.utcnow() + timedelta(settings.auth.REFRESH_TOKEN_EXPIRE),
    )

    session.add(new_db_token)
    await session.commit()

    new_access_token = create_access_token({"sub": str(user_id)})
    response.set_cookie(key="user_access_token", value=new_access_token, httponly=True)
    response.set_cookie(key="user_refresh_token", value=new_refresh, httponly=True)

    return {"access_token": new_access_token}


@router.get("/logout")
async def logout(
    request: Request,
    response: Response,
    session: AsyncSession = Depends(db_helper.session_getter),
):
    refresh_token = request.cookies.get("user_refresh_token")

    if refresh_token:
        hashed = hash_refresh_token(refresh_token)
        stmt = select(RefreshToken).where(RefreshToken.token_hash == hashed)
        result = await session.execute(stmt)
        db_token = result.scalars().one_or_none()

        if db_token:
            await session.delete(db_token)
            await session.commit()

    response.delete_cookie("user_access_token")
    response.delete_cookie("user_refresh_token")

    return {"message": "Вы вышли из системы"}
