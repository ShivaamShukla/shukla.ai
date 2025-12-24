from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum

class ProjectType(str, Enum):
    WEB = "web"
    MOBILE = "mobile"
    AGENT = "agent"
    INTEGRATION = "integration"

class ProjectStatus(str, Enum):
    DRAFT = "draft"
    BUILDING = "building"
    DEPLOYED = "deployed"
    FAILED = "failed"

class Project(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    userId: str
    name: str
    description: Optional[str] = None
    type: ProjectType = ProjectType.WEB
    status: ProjectStatus = ProjectStatus.DRAFT
    url: Optional[str] = None
    settings: Dict[str, Any] = {}
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "userId": "user123",
                "name": "My Awesome App",
                "description": "A revolutionary app",
                "type": "web",
                "status": "draft"
            }
        }

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    type: ProjectType = ProjectType.WEB

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ProjectStatus] = None
    url: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None