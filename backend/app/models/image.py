from sqlalchemy import Column, Integer, String, ForeignKey, Enum, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


class ImageCategory(str, enum.Enum):
    bathroom = "bathroom"
    balcony = "balcony"
    gate = "gate"
    sitting_room = "sitting_room"
    bedroom = "bedroom"
    kitchen = "kitchen"
    other = "other"


class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)
    image_url = Column(String, nullable=False)
    public_id = Column(String, nullable=True)  # Cloudinary public ID
    category = Column(Enum(ImageCategory), default=ImageCategory.other)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    property = relationship("Property", back_populates="images")