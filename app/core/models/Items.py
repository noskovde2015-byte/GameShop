from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, relationship, mapped_column
from typing import TYPE_CHECKING
from core.models.base import Base

if TYPE_CHECKING:
    from .user import User


class Item(Base):
    __tablename__ = "items"
    name: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str] = mapped_column(nullable=True, default="")
    price: Mapped[float] = mapped_column(nullable=False)
    category: Mapped[str] = mapped_column(nullable=False)

    seller_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    seller: Mapped["User"] = relationship(back_populates="items")
