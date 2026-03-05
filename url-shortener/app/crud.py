from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta
from typing import Optional

from . import models, schemas, utils

def get_db_url_by_code(db: Session, code: str) -> Optional[models.URL]:
    return db.query(models.URL).filter(models.URL.code == code).first()

def create_db_url(db: Session, url: schemas.URLCreate) -> models.URL:
    chars = 6
    code = utils.create_random_code(chars)
    while get_db_url_by_code(db, code):
        code = utils.create_random_code(chars)

    expires_at = None
    if url.expires_in_days:
        expires_at = datetime.now(timezone.utc) + timedelta(days=url.expires_in_days)

    db_url = models.URL(
        long_url=str(url.long_url),
        code=code,
        expires_at=expires_at
    )
    db.add(db_url)
    db.commit()
    db.refresh(db_url)
    return db_url

def update_db_clicks(db: Session, db_url: models.URL) -> models.URL:
    db_url.clicks += 1
    db.commit()
    db.refresh(db_url)
    return db_url
