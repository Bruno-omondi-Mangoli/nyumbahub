from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User, UserRole
from app.models.property import Property, PropertyStatus
from app.models.booking import Booking
from app.schemas.user import UserResponse
from app.schemas.property import PropertyResponse, PropertyUpdate
from app.core.dependencies import get_current_admin
from app.routers.properties import build_property_response

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/dashboard")
def admin_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Admin dashboard analytics."""
    total_users = db.query(User).count()
    total_tenants = db.query(User).filter(User.role == UserRole.tenant).count()
    total_landlords = db.query(User).filter(User.role == UserRole.landlord).count()
    total_properties = db.query(Property).count()
    active_properties = db.query(Property).filter(
        Property.status == PropertyStatus.active
    ).count()
    inactive_properties = db.query(Property).filter(
        Property.status == PropertyStatus.inactive
    ).count()
    total_bookings = db.query(Booking).count()

    return {
        "total_users": total_users,
        "total_tenants": total_tenants,
        "total_landlords": total_landlords,
        "total_properties": total_properties,
        "active_properties": active_properties,
        "inactive_properties": inactive_properties,
        "total_bookings": total_bookings
    }


@router.get("/users", response_model=List[UserResponse])
def list_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Admin views all users."""
    return db.query(User).all()


@router.put("/users/{user_id}/toggle-active", response_model=UserResponse)
def toggle_user_active(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Admin activates or suspends a user."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = not user.is_active
    db.commit()
    db.refresh(user)
    return user


@router.get("/properties", response_model=List[PropertyResponse])
def list_all_properties(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Admin views all properties."""
    properties = db.query(Property).all()
    return [build_property_response(p) for p in properties]


@router.put("/properties/{property_id}/status", response_model=PropertyResponse)
def update_property_status(
    property_id: int,
    property_data: PropertyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Admin approves or suspends a property listing."""
    prop = db.query(Property).filter(Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    if property_data.status:
        prop.status = property_data.status
    db.commit()
    db.refresh(prop)
    return build_property_response(prop)