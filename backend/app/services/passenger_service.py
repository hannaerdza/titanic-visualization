import pandas as pd
from sqlalchemy.orm import Session
from .. import models

def import_csv_to_db(db: Session, file_path: str):
    """Import CSV data into the database"""
    # Read CSV file
    df = pd.read_csv(file_path)
    
    # Clear existing data
    db.query(models.Passenger).delete()
    
    # Insert new data
    for _, row in df.iterrows():
        passenger = models.Passenger(
            PassengerId=int(row['PassengerId']),
            Survived=int(row['Survived']),
            Pclass=int(row['Pclass']),
            Name=row['Name'],
            Sex=row['Sex'],
            Age=float(row['Age']) if not pd.isna(row['Age']) else None,
            SibSp=int(row['SibSp']),
            Parch=int(row['Parch']),
            Ticket=row['Ticket'],
            Fare=float(row['Fare']),
            Cabin=row['Cabin'] if not pd.isna(row['Cabin']) else None,
            Embarked=row['Embarked'] if not pd.isna(row['Embarked']) else None
        )
        db.add(passenger)
    
    db.commit()
    return {"message": "CSV data imported successfully"}

def get_all_passengers(db: Session, skip: int = 0, limit: int = 100):
    """Get all passengers with pagination"""
    return db.query(models.Passenger).offset(skip).limit(limit).all()

def get_passenger_by_id(db: Session, passenger_id: int):
    """Get a passenger by ID"""
    return db.query(models.Passenger).filter(models.Passenger.PassengerId == passenger_id).first()

def get_survival_statistics(db: Session):
    """Get survival statistics by different categories"""
    # Total survivors
    total_passengers = db.query(models.Passenger).count()
    survivors = db.query(models.Passenger).filter(models.Passenger.Survived == 1).count()
    survival_rate = survivors / total_passengers if total_passengers > 0 else 0
    
    # Survival by class
    class_data = []
    for pclass in [1, 2, 3]:
        class_total = db.query(models.Passenger).filter(models.Passenger.Pclass == pclass).count()
        class_survived = db.query(models.Passenger).filter(
            models.Passenger.Pclass == pclass,
            models.Passenger.Survived == 1
        ).count()
        class_rate = class_survived / class_total if class_total > 0 else 0
        class_data.append({
            "class": pclass,
            "total": class_total,
            "survived": class_survived,
            "rate": class_rate
        })
    
    # Survival by gender
    gender_data = []
    for gender in ["male", "female"]:
        gender_total = db.query(models.Passenger).filter(models.Passenger.Sex == gender).count()
        gender_survived = db.query(models.Passenger).filter(
            models.Passenger.Sex == gender,
            models.Passenger.Survived == 1
        ).count()
        gender_rate = gender_survived / gender_total if gender_total > 0 else 0
        gender_data.append({
            "gender": gender,
            "total": gender_total,
            "survived": gender_survived,
            "rate": gender_rate
        })
    
    return {
        "total": {
            "passengers": total_passengers,
            "survivors": survivors,
            "rate": survival_rate
        },
        "by_class": class_data,
        "by_gender": gender_data
    }

def filter_passengers(db: Session, survived=None, pclass=None, sex=None, min_age=None, max_age=None, embarked=None):
    """Filter passengers based on criteria"""
    query = db.query(models.Passenger)
    
    if survived is not None:
        query = query.filter(models.Passenger.Survived == survived)
    
    if pclass is not None:
        query = query.filter(models.Passenger.Pclass == pclass)
        
    if sex is not None:
        query = query.filter(models.Passenger.Sex == sex)
        
    if min_age is not None:
        query = query.filter(models.Passenger.Age >= min_age)
        
    if max_age is not None:
        query = query.filter(models.Passenger.Age <= max_age)
        
    if embarked is not None:
        query = query.filter(models.Passenger.Embarked == embarked)
        
    return query.all()