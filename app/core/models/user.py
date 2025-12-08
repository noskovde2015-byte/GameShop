from pydantic import BaseModel
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING
from enum import Enum as PyEnum
from core.models.base import Base

if TYPE_CHECKING:
    from .Items import Item


class UserRole(PyEnum):
    BUYER = "buyer"
    SELLER = "seller"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"

    name: Mapped[str] = mapped_column(nullable=False)
    surname: Mapped[str] = mapped_column(nullable=False)
    nickname: Mapped[str] = mapped_column(unique=True, nullable=False)
    age: Mapped[int] = mapped_column(nullable=False)
    email: Mapped[str] = mapped_column(unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    role: Mapped[UserRole] = mapped_column(default=UserRole.BUYER)

    items: Mapped[list["Item"]] = relationship(back_populates="seller")
