from sqlalchemy import ForeignKey, Text, Float, String
from sqlalchemy.orm import Mapped, relationship, mapped_column
from typing import TYPE_CHECKING
from core.models.base import Base


class Photo(Base):
    __tablename__ = "photos"
    name: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str] = mapped_column(nullable=True, default="")
