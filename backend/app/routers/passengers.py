from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import models, database
from ..services import passenger_service
import os
import shutil

# Setup router for passenger-related endpoints
router = APIRouter(
    prefix="/passengers",
    tags=["passengers"]
)

@router.post("/import-csv/")
async def import_csv(file: UploadFile = File(...), db: Session = Depends(database.get_db)):
    # Save uploaded file temporarily
    temp_file_path = f"temp_{file.filename}"
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Import to database
    try:
        result = passenger_service.import_csv_to_db(db, temp_file_path)
        # Clean up temp file
        os.remove(temp_file_path) # remove temp file after use
        return result
    except Exception as e:
        # Remove temp file on error too
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        raise HTTPException(status_code=500, detail=f"Failed to import CSV: {str(e)}")

@router.get("/")
def get_passengers(
    skip: int = 0, 
    limit: int = 100,
    survived: Optional[int] = Query(None, description="Filter by survival (0 or 1)"),
    pclass: Optional[int] = Query(None, description="Filter by passenger class (1, 2, or 3)"),
    sex: Optional[str] = Query(None, description="Filter by gender (male or female)"),
    min_age: Optional[float] = Query(None, description="Filter by minimum age"),
    max_age: Optional[float] = Query(None, description="Filter by maximum age"),
    embarked: Optional[str] = Query(None, description="Filter by port of embarkation (C, Q, or S)"),
    db: Session = Depends(database.get_db)
):
    # Return filtered data if any filters are used
    if any([survived is not None, pclass is not None, sex is not None, 
            min_age is not None, max_age is not None, embarked is not None]):
        return passenger_service.filter_passengers(
            db, survived, pclass, sex, min_age, max_age, embarked
        )
    # Else return all passengers
    return passenger_service.get_all_passengers(db, skip, limit)

@router.get("/statistics")
def get_statistics(db: Session = Depends(database.get_db)):
    # Basic stats like survival rate
    return passenger_service.get_survival_statistics(db)

@router.get("/{passenger_id}")
def get_passenger(passenger_id: int, db: Session = Depends(database.get_db)):
    # Get passenger by ID
    passenger = passenger_service.get_passenger_by_id(db, passenger_id)
    if passenger is None:
        raise HTTPException(status_code=404, detail="Passenger not found")
    return passenger