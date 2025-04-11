from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, get_db
from . import models
from .routers import passengers
import os
import pandas as pd
from sqlalchemy.orm import Session
from .services import passenger_service

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Titanic API", description="API for Titanic dataset visualization")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(passengers.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Titanic API"}

# Initialize database with data if CSV is available
@app.on_event("startup")
async def startup_db_client():
    # Check if data directory exists in the expected location
    csv_path = "../data/train.csv"
    # For Docker environment
    if os.path.exists("/app/data/train.csv"):
        csv_path = "/app/data/train.csv"
    
    if os.path.exists(csv_path):
        db = next(get_db())
        try:
            # Only import if the database is empty
            if db.query(models.Passenger).count() == 0:
                passenger_service.import_csv_to_db(db, csv_path)
                print(f"Imported Titanic data from {csv_path}")
            else:
                print("Database already contains data, skipping import")
        except Exception as e:
            print(f"Error during initial data import: {e}")
        finally:
            db.close()