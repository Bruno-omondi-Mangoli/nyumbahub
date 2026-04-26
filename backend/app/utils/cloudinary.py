import cloudinary
import cloudinary.uploader
from app.core.config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)


def upload_image(file_bytes: bytes, folder: str = "nyumbahub", public_id: str = None) -> dict:
    """Upload an image to Cloudinary and return the result."""
    options = {
        "folder": folder,
        "resource_type": "image",
        "overwrite": True,
    }
    if public_id:
        options["public_id"] = public_id

    result = cloudinary.uploader.upload(file_bytes, **options)
    return {
        "url": result.get("secure_url"),
        "public_id": result.get("public_id"),
    }


def delete_image(public_id: str) -> bool:
    """Delete an image from Cloudinary."""
    result = cloudinary.uploader.destroy(public_id)
    return result.get("result") == "ok"