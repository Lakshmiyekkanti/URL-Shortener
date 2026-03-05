# FastAPI URL Shortener

A complete URL shortener backend built with Python FastAPI and MySQL.

## Features
- Create short URLs with optional expiration dates
- Redirect to the original URL and track clicks
- Retrieve statistics for short URLs (click count, creation date, expiration date)
- MySQL database with SQLAlchemy ORM

## Project Structure
- `app/main.py`: FastAPI endpoints
- `app/config.py`: Environment configurations
- `app/models.py`: SQLAlchemy database models
- `app/schemas.py`: Pydantic validation schemas
- `app/crud.py`: Database interaction functions
- `app/utils.py`: Utility functions for short code generation
- `app/database.py`: SQLAlchemy database engine and session

## Requirements
- Python 3.8+
- MySQL Server

## Setup Instructions

1. **Clone or Download the repository**

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate # On Windows use: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Variables:**
   Update the `.env` file with your MySQL credentials:
   ```env
   DATABASE_URL=mysql+pymysql://root:password@localhost:3306/url_shortener
   ```
   > Make sure to create the database `url_shortener` in your MySQL server before running the app.

5. **Run the Application:**
   ```bash
   uvicorn app.main:app --reload
   ```
   The application will run at `http://localhost:8000`.

## API Documentation

FastAPI provides automatic interactive API documentation:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### Example Requests

**1. Shorten a URL**
```bash
curl -X POST "http://localhost:8000/api/shorten" \
     -H "Content-Type: application/json" \
     -d '{"long_url": "https://www.example.com", "expires_in_days": 7}'
```

**2. Redirect to Original URL**
```bash
curl -X GET "http://localhost:8000/{short_code}"
```

**3. Get URL Statistics**
```bash
curl -X GET "http://localhost:8000/api/stats/{short_code}"
```
