from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.booking import BookingStatus


class BookingCreate(BaseModel):
    property_id: int
    message: Optional[str] = None


class BookingUpdate(BaseModel):
    status: BookingStatus


class BookingResponse(BaseModel):
    id: int
    tenant_id: int
    property_id: int
    status: BookingStatus
    message: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class BookingListResponse(BaseModel):
    total: int
    results: List[BookingResponse]