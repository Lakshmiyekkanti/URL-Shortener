from sqlalchemy import Column, Integer, String, DateTime
from .database import Base
from datetime import datetime, timezone

class URL(Base):
    __tablename__ = "short_urls"

    id = Column(Integer, primary_key=True, index=True)
    long_url = Column(String(2048), index=True, nullable=False)
    code = Column(String(20), unique=True, index=True, nullable=False)
    clicks = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    expires_at = Column(DateTime, nullable=True)
