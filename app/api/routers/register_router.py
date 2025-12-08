from fastapi import APIRouter, Depends, HTTPException
from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.status import HTTP_409_CONFLICT

from core.auth import hash_password
from core.config import settings
from core.models import User, db_helper
from core.shemas.UserShema import UserCreate


router = APIRouter(prefix=settings.prefix.auth, tags=["Auth"])


@router.post("")
async def register_user(
    user_data: UserCreate, session: AsyncSession = Depends(db_helper.session_getter)
):
    try:
        user = await session.scalar(select(User).where(User.email == user_data.email))

        if user is not None:
            raise HTTPException(
                status_code=HTTP_409_CONFLICT, detail="Email already registered"
            )

        new_user = User(
            email=user_data.email,
            password=hash_password(user_data.password),
            name=user_data.name,
            surname=user_data.surname,
            nickname=user_data.nickname,
            age=user_data.age,
        )
        session.add(new_user)
        await session.commit()
        await session.refresh(new_user)
        return {"message": "User registered successfully"}
    except ValidationError as e:
        raise HTTPException(status_code=422, detail=e.errors())
