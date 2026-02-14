from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class SubmissionCreate(BaseModel):
    data: dict[str, Any] = Field(default_factory=dict)


class SubmissionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    form_id: int
    data: dict[str, Any]
    created_at: datetime
