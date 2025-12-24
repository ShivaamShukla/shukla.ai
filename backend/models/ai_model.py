from pydantic import BaseModel, Field
from typing import Optional, Dict
from datetime import datetime

class AIModel(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    name: str
    displayName: str
    provider: str  # openai, anthropic, google
    maxTokens: int
    pricePerThousandTokens: float
    enabled: bool = True
    description: Optional[str] = None
    capabilities: Dict[str, bool] = {
        "vision": False,
        "function_calling": False,
        "streaming": True
    }
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class ModelCreate(BaseModel):
    name: str
    displayName: str
    provider: str
    maxTokens: int
    pricePerThousandTokens: float
    enabled: bool = True
    description: Optional[str] = None
    capabilities: Optional[Dict[str, bool]] = None

class ModelUpdate(BaseModel):
    displayName: Optional[str] = None
    maxTokens: Optional[int] = None
    pricePerThousandTokens: Optional[float] = None
    enabled: Optional[bool] = None
    description: Optional[str] = None
    capabilities: Optional[Dict[str, bool]] = None