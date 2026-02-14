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


class FormCreate(BaseModel):
    title: str = ""
    blocks: list[FormBlock] = Field(default_factory=list)


class FormUpdate(BaseModel):
    title: Optional[str] = None
    blocks: Optional[list[FormBlock]] = None


class FormOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    blocks: list[FormBlock]
    share_id: str
    share_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime
