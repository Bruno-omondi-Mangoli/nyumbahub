from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.booking import Booking, BookingStatus
from app.models.property import Property, PropertyStatus
from app.models.unit import Unit, UnitStatus
from app.models.user import User
from app.schemas.booking import BookingCreate, BookingUpdate, BookingResponse, BookingListResponse
from app.core.dependencies import get_current_user, get_current_tenant, get_current_landlord

router = APIRouter(prefix="/bookings", tags=["Bookings"])


# ─── TENANT ROUTES ────────────────────────────────────────────────────────────

@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    booking_data: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_tenant)
):
    """Tenant expresses interest in a property."""
    prop = db.query(Property).filter(Property.id == booking_data.property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    if prop.status != PropertyStatus.active:
        raise HTTPException(status_code=400, detail="Property is not available")

    # Check vacant units exist
    vacant = db.query(Unit).filter(
        Unit.property_id == prop.id,
        Unit.status == UnitStatus.vacant
    ).count()
    if vacant == 0:
        raise HTTPException(status_code=400, detail="No vacant units available")

    # Prevent duplicate booking
    existing = db.query(Booking).filter(
        Booking.tenant_id == current_user.id,
        Booking.property_id == booking_data.property_id,
        Booking.status == BookingStatus.pending
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You already have a pending booking for this property")

    booking = Booking(
        tenant_id=current_user.id,
        property_id=booking_data.property_id,
        message=booking_data.message
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


@router.get("/my-bookings", response_model=BookingListResponse)
def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_tenant)
):
    """Get all bookings made by the logged-in tenant."""
    bookings = db.query(Booking).filter(
        Booking.tenant_id == current_user.id
    ).all()
    return {"total": len(bookings), "results": bookings}


@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_tenant)
):
    """Tenant cancels their booking."""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.tenant_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your booking")
    db.delete(booking)
    db.commit()


# ─── LANDLORD ROUTES ─────────────────────────────────────────────────────────

@router.get("/property/{property_id}", response_model=BookingListResponse)
def get_property_bookings(
    property_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_landlord)
):
    """Landlord views all booking interests for their property."""
    prop = db.query(Property).filter(Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    if prop.landlord_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your property")

    bookings = db.query(Booking).filter(Booking.property_id == property_id).all()
    return {"total": len(bookings), "results": bookings}


@router.put("/{booking_id}", response_model=BookingResponse)
def update_booking_status(
    booking_id: int,
    booking_data: BookingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_landlord)
):
    """Landlord confirms or rejects a booking."""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    prop = db.query(Property).filter(Property.id == booking.property_id).first()
    if prop.landlord_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your property")

    booking.status = booking_data.status

    # If confirmed, mark one unit as occupied
    if booking_data.status == BookingStatus.confirmed:
        vacant_unit = db.query(Unit).filter(
            Unit.property_id == prop.id,
            Unit.status == UnitStatus.vacant
        ).first()
        if vacant_unit:
            vacant_unit.status = UnitStatus.occupied

    db.commit()
    db.refresh(booking)
    return booking