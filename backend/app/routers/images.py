from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.image import Image, ImageCategory
from app.models.property import Property
from app.models.user import User
from app.utils.cloudinary import upload_image, delete_image
from app.core.dependencies import get_current_landlord
from pydantic import BaseModel

router = APIRouter(prefix="/images", tags=["Images"])


class ImageResponse(BaseModel):
    id: int
    property_id: int
    image_url: str
    public_id: str | None
    category: ImageCategory

    class Config:
        from_attributes = True


@router.post("/upload/{property_id}", response_model=List[ImageResponse])
async def upload_property_images(
    property_id: int,
    category: ImageCategory = Form(...),
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_landlord)
):
    """Upload images for a property. Landlord only."""
    prop = db.query(Property).filter(Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    if prop.landlord_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your property")

    uploaded = []
    for file in files:
        contents = await file.read()
        result = upload_image(contents, folder=f"nyumbahub/property_{property_id}")

        image = Image(
            property_id=property_id,
            image_url=result["url"],
            public_id=result["public_id"],
            category=category
        )
        db.add(image)
        db.commit()
        db.refresh(image)
        uploaded.append(image)

    return uploaded


@router.delete("/{image_id}", status_code=204)
def delete_property_image(
    image_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_landlord)
):
    """Delete an image. Landlord only."""
    image = db.query(Image).filter(Image.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    prop = db.query(Property).filter(Property.id == image.property_id).first()
    if prop.landlord_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your property")

    if image.public_id:
        delete_image(image.public_id)

    db.delete(image)
    db.commit()


@router.get("/property/{property_id}", response_model=List[ImageResponse])
def get_property_images(property_id: int, db: Session = Depends(get_db)):
    """Get all images for a property. Public."""
    return db.query(Image).filter(Image.id == property_id).all()