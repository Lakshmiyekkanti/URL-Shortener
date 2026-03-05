# URL Shortener (FastAPI + MySQL)

A scalable **URL Shortener service** built with **FastAPI and MySQL** that converts long URLs into short links and tracks analytics such as click counts and expiration.

This project demonstrates **backend API development, database design, and RESTful service architecture**.

---

# Features

* Generate short URLs from long URLs
* Automatic unique short code generation
* Redirect short URLs to the original destination
* Track number of clicks for each link
* Optional expiration for links
* REST API built using FastAPI
* MySQL database with SQLAlchemy ORM

---

# Tech Stack

Backend

* Python
* FastAPI
* SQLAlchemy

Database

* MySQL

Tools

* Uvicorn
* python-dotenv

---

# Project Structure

```
url-shortener
│
├── app
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── crud.py
│   └── utils.py
│
├── requirements.txt
├── .env
└── README.md
```

---

# How It Works

1. User submits a long URL
2. System generates a unique short code
3. Short code is stored in the database
4. When accessed, the short code redirects to the original URL
5. Each visit increments the click count

Example:

Input URL

```
https://google.com
```

Generated Short URL

```
http://localhost:8000/aB12c
```

---

# Setup Instructions

### 1 Clone Repository

```
git clone https://github.com/yourusername/url-shortener.git
cd url-shortener
```

---

### 2 Create Virtual Environment

```
python -m venv venv
```

Activate environment

Windows

```
venv\Scripts\activate
```

Linux / Mac

```
source venv/bin/activate
```

---

### 3 Install Dependencies

```
pip install -r requirements.txt
```

---

### 4 Configure Environment Variables

Create `.env`

```
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/url_shortener
```

Make sure the database exists:

```
CREATE DATABASE url_shortener;
```

---

### 5 Run Application

```
uvicorn app.main:app --reload
```

Server will run at

```
http://localhost:8000
```

---

# API Documentation

FastAPI automatically generates API docs.

Swagger UI
http://localhost:8000/docs

ReDoc
http://localhost:8000/redoc

---

# Example API Requests

### Shorten URL

```
POST /api/shorten
```

Request

```
{
  "long_url": "https://example.com",
  "expires_in_days": 7
}
```

---

### Redirect URL

```
GET /{short_code}
```

Redirects to original URL.

---

### Get URL Statistics

```
GET /api/stats/{short_code}
```

Returns

* original URL
* click count
* creation date
* expiration date

---

# Future Improvements

* Custom short aliases
* QR code generation
* URL analytics dashboard
* Rate limiting
* Docker deployment

---

# Author

Lakshmi Yekkanti
Computer Science Engineering Student
