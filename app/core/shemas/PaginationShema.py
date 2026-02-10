from pydantic import BaseModel

from core.shemas.ItemShema import ItemRead


class PageMeta(BaseModel):
    page: int
    size: int
    total: int
    pages: int


class PaginatedItems(BaseModel):
    meta: PageMeta
    items: list[ItemRead]
