from fastapi import APIRouter, Depends, Response, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from core.models import db_helper
from core.config import settings
from core.shemas.UserShema import UserAuth
from core.auth import authenticate_user, create_access_token

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

    access_token = create_access_token({"sub": str(check.id)})
    response.set_cookie(key="user_access_token", value=access_token, httponly=True)
    return {"access_token": access_token}
