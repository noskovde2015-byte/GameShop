from sqlalchemy import ForeignKey
from .base import Base
from sqlalchemy.orm import Mapped, relationship, mapped_column
from core.models.base import Base


class Favorite(Base):
    __tablename__ = "favorites"
    id = None
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    item_id: Mapped[int] = mapped_column(ForeignKey("items.id"), primary_key=True)
