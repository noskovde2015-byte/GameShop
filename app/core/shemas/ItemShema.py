from pydantic import BaseModel, Field, ConfigDict


class ItemCreate(BaseModel):
    name: str = Field(max_length=100)
    description: str | None = None
    price: float = Field(gt=0)
    category: str = Field(max_length=50)
    system_requirements: str | None = None


class ItemUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: float | None = None
    category: str | None = None
    system_requirements: str | None = None
    rating: float | None = Field(default=None, ge=0, le=5)


class ItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str | None
    price: float
    category: str
    system_requirements: str | None
    rating: float
    seller_id: int
