from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from app.database import get_db
from app.models.property import Property, PropertyStatus, HouseType
from app.models.unit import Unit, UnitStatus
from app.models.user import User
from app.schemas.property import (
    PropertyCreate, PropertyUpdate, PropertyResponse, PropertyListResponse
)
from app.core.dependencies import get_current_user, get_current_landlord

router = APIRouter(prefix="/properties", tags=["Properties"])


def build_property_response(prop: Property) -> dict:
    """Add vacant/occupied unit counts to property."""
    vacant = sum(1 for u in prop.units if u.status == UnitStatus.vacant)
    occupied = sum(1 for u in prop.units if u.status == UnitStatus.occupied)
    data = PropertyResponse.model_validate(prop).model_dump()
    data["vacant_units"] = vacant
    data["occupied_units"] = occupied
    return data


# ─── PUBLIC ROUTES ───────────────────────────────────────────────────────────

@router.get("/", response_model=PropertyListResponse)
def list_properties(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    house_type: Optional[HouseType] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    location: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """List all active properties with optional filters. Public endpoint."""
    query = db.query(Property).filter(
        Property.status == PropertyStatus.active
    )

    if house_type:
        query = query.filter(Property.house_type == house_type)
    if min_price is not None:
        query = query.filter(Property.price >= min_price)
    if max_price is not None:
        query = query.filter(Property.price <= max_price)
    if location:
        query = query.filter(
            Property.location.ilike(f"%{location}%")
        )

    total = query.count()
    properties = query.offset((page - 1) * page_size).limit(page_size).all()

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "results": [build_property_response(p) for p in properties]
    }


@router.get("/{property_id}", response_model=PropertyResponse)
def get_property(property_id: int, db: Session = Depends(get_db)):
    """Get a single property by ID. Public endpoint."""
    prop = db.query(Property).filter(Property.id == property_id).first()
    if not prop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    return build_property_response(prop)


# ─── LANDLORD ROUTES ─────────────────────────────────────────────────────────

@router.post("/", response_model=PropertyResponse, status_code=status.HTTP_201_CREATED)
def create_property(
    property_data: PropertyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_landlord)
):
    """Create a new property listing. Landlord only."""
    new_property = Property(
        landlord_id=current_user.id,
        **property_data.model_dump()
    )
    db.add(new_property)
    db.commit()
    db.refresh(new_property)

    # Auto-create units based on total_units
    for i in range(1, property_data.total_units + 1):
        unit = Unit(
            property_id=new_property.id,
            unit_number=str(i),
            status=UnitStatus.vacant
        )
        db.add(unit)
    db.commit()
    db.refresh(new_property)

    return build_property_response(new_property)


@router.put("/{property_id}", response_model=PropertyResponse)
def update_property(
    property_id: int,
    property_data: PropertyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_landlord)
):
    """Update a property. Only the owner landlord can update."""
    prop = db.query(Property).filter(Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    if prop.landlord_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your property")

    for field, value in property_data.model_dump(exclude_unset=True).items():
        setattr(prop, field, value)

    db.commit()
    db.refresh(prop)
    return build_property_response(prop)


@router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_property(
    property_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_landlord)
):
    """Delete a property. Only the owner landlord can delete."""
    prop = db.query(Property).filter(Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    if prop.landlord_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your property")

    db.delete(prop)
    db.commit()


@router.get("/landlord/my-properties", response_model=List[PropertyResponse])
def get_my_properties(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_landlord)
):
    """Get all properties owned by the logged-in landlord."""
    properties = db.query(Property).filter(
        Property.landlord_id == current_user.id
    ).all()
    return [build_property_response(p) for p in properties]