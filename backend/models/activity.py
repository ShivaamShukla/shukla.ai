from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

class Activity(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    userId: str
    action: str
    resource: str
    metadata: Dict[str, Any] = {}
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class ActivityCreate(BaseModel):
    userId: str
    action: str
    resource: str
    metadata: Dict[str, Any] = {}