from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from . import models, schemas, crud
from .database import SessionLocal, engine
from .config import get_settings

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="URL Shortener API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/api/shorten", response_model=schemas.URLInfo)
def create_url(url: schemas.URLCreate, db: Session = Depends(get_db)):
    db_url = crud.create_db_url(db=db, url=url)
    db_url.short_url = f"{get_settings().base_url}/{db_url.code}"
    return db_url

@app.get("/{code}")
def forward_to_target_url(code: str, db: Session = Depends(get_db)):
    db_url = crud.get_db_url_by_code(db=db, code=code)
    if not db_url:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="URL not found"
        )
    
    # Optional logic to check if a URL has expired
    if db_url.expires_at:
        # Check against naive since we saved it unaware, or naive depending on your DB
        # If DB saves it without timezone but it represents UTC:
        now_utc = datetime.now(timezone.utc).replace(tzinfo=None)
        if db_url.expires_at < now_utc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="URL has expired"
            )

    crud.update_db_clicks(db=db, db_url=db_url)
    return RedirectResponse(db_url.long_url)

@app.get("/api/stats/{code}", response_model=schemas.URLStats)
def get_url_stats(code: str, db: Session = Depends(get_db)):
    db_url = crud.get_db_url_by_code(db=db, code=code)
    if not db_url:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="URL not found"
        )
    return db_url
