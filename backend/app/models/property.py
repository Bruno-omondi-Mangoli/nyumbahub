from sqlalchemy import Column, Integer, String, Float, ForeignKey, Enum, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


class HouseType(str, enum.Enum):
    bedsitter = "bedsitter"
    single_room = "single_room"
    one_br = "1BR"
    two_br = "2BR"
    three_br = "3BR"
    four_br = "4BR"


class PropertyStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"
    suspended = "suspended"


class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    landlord_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    location = Column(String, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    total_units = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    house_type = Column(Enum(HouseType), nullable=False)
    amenities = Column(JSON, default=list)
    status = Column(Enum(PropertyStatus), default=PropertyStatus.active)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    landlord = relationship("User", back_populates="properties")
    units = relationship("Unit", back_populates="property")
    images = relationship("Image", back_populates="property")
    bookings = relationship("Booking", back_populates="property")