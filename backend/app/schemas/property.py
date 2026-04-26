from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.property import HouseType, PropertyStatus


class PropertyCreate(BaseModel):
    name: str
    description: Optional[str] = None
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    total_units: int
    price: float
    house_type: HouseType
    amenities: Optional[List[str]] = []


class PropertyUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    total_units: Optional[int] = None
    price: Optional[float] = None
    house_type: Optional[HouseType] = None
    amenities: Optional[List[str]] = None
    status: Optional[PropertyStatus] = None


class PropertyResponse(BaseModel):
    id: int
    landlord_id: int
    name: str
    description: Optional[str]
    location: str
    latitude: Optional[float]
    longitude: Optional[float]
    total_units: int
    price: float
    house_type: HouseType
    amenities: List[str]
    status: PropertyStatus
    created_at: datetime
    vacant_units: Optional[int] = 0
    occupied_units: Optional[int] = 0

    class Config:
        from_attributes = True


class PropertyListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    results: List[PropertyResponse]