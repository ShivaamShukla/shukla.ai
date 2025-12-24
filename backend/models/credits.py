from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class CreditTransaction(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    userId: str
    amount: float
    type: str  # credit, debit, bonus, purchase
    description: str
    conversationId: Optional[str] = None
    metadata: dict = {}
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class UserCredits(BaseModel):
    userId: str
    balance: float
    totalEarned: float = 0.0
    totalSpent: float = 0.0
    lastUpdated: datetime = Field(default_factory=datetime.utcnow)