from pydantic import BaseModel, Field, EmailStr, ConfigDict, field_validator


class UserBase(BaseModel):
    """
    name: Mapped[str] = mapped_column(nullable=False)
    surname: Mapped[str] = mapped_column(nullable=False)
    nickname: Mapped[str] = mapped_column(unique=True, nullable=False)
    age: Mapped[int] = mapped_column(nullable=False)
    email: Mapped[str] = mapped_column(unique=True, nullable=False)
    role: Mapped[UserRole] = mapped_column(default=UserRole.BUYER)

    items: Mapped[list["Item"]] = relationship(back_populates="seller")
    """

    name: str = Field(max_length=25)
    surname: str = Field(max_length=25)
    nickname: str = Field(max_length=50)
    age: int = Field(ge=0)
    email: EmailStr


class UserAuth(BaseModel):
    email: EmailStr
    password: str


class UserCreate(UserBase):
    password: str


class UserRead(UserBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
