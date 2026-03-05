from pydantic import BaseModel, HttpUrl
from datetime import datetime
from typing import Optional

class URLBase(BaseModel):
    long_url: HttpUrl

class URLCreate(URLBase):
    expires_in_days: Optional[int] = None

class URLInfo(URLBase):
    short_url: str
    code: str

class URLStats(URLBase):
    clicks: int
    created_at: datetime
    expires_at: Optional[datetime] = None

    class Config:
        from_attributes = True
