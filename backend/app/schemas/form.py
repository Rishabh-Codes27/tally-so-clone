from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class FormBlock(BaseModel):
    id: str
    type: str
    content: str = ""
    options: Optional[list[str]] = None
    required: Optional[bool] = None
    placeholder: Optional[str] = None
    rows: Optional[list[str]] = None
    columns: Optional[list[str]] = None
    timeStart: Optional[str] = None
    timeEnd: Optional[str] = None
    timeStep: Optional[int] = None
    scaleMin: Optional[int] = None
    scaleMax: Optional[int] = None
    ratingMax: Optional[int] = None
    fileMaxSizeMb: Optional[float] = None
    fileAllowedTypes: Optional[list[str]] = None
    paymentAmount: Optional[float] = None
    paymentCurrency: Optional[str] = None
    paymentDescription: Optional[str] = None


class FormCreate(BaseModel):
    title: str = ""
    blocks: list[FormBlock] = Field(default_factory=list)


class FormUpdate(BaseModel):
    title: Optional[str] = None
    logo_url: Optional[str] = None
    cover_url: Optional[str] = None
    cover_height: Optional[int] = None
    blocks: Optional[list[FormBlock]] = None


class FormOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    logo_url: Optional[str] = None
    cover_url: Optional[str] = None
    cover_height: int = 200
    blocks: list[FormBlock]
    share_id: str
    share_url: Optional[str] = None
    response_count: int = 0
    created_at: datetime
    updated_at: datetime
