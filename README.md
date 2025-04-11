# Titanic Data Visualization

A full-stack application to visualize Titanic disaster data using Python FastAPI for the backend, React for the frontend, and Docker for containerization.

## Features

- **Backend API**: 
  - Upload CSV data to database
  - Query passenger data with filtering options
  - Get survival statistics

- **Frontend Visualization**:
  - Interactive table with all passenger data
  - Multiple chart visualizations (survival by class, gender, etc.)
  - Filter data by various criteria

## Tech Stack

- **Backend**: Python 3.x, FastAPI, SQLAlchemy, Pandas
- **Frontend**: React, Material-UI, Recharts
- **Database**: SQLite (for simplicity)
- **Deployment**: Docker, Docker Compose

## Getting Started

### Prerequisites

- Docker and Docker Compose installed on your system
- Git

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/titanic-visualization.git
   cd titanic-visualization
   ```

2. Download the Titanic dataset:
   - Download the `train.csv` file from [Kaggle](https://www.kaggle.com/c/titanic/data)
   - Place it in the `data` directory at the project root

3. Start the application with Docker Compose:
   ```bash
   docker-compose up --build
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs



