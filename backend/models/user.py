from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"

class AuthProvider(str, Enum):
    GOOGLE = "google"
    EMAIL = "email"

class SubscriptionPlan(str, Enum):
    FREE = "free"
    STANDARD = "standard"
    PRO = "pro"

class SubscriptionStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"

class Subscription(BaseModel):
    plan: SubscriptionPlan = SubscriptionPlan.FREE
    status: SubscriptionStatus = SubscriptionStatus.ACTIVE
    startDate: Optional[datetime] = None
    endDate: Optional[datetime] = None

class User(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    email: EmailStr
    name: str
    avatar: Optional[str] = None
    role: UserRole = UserRole.USER
    provider: AuthProvider = AuthProvider.EMAIL
    password: Optional[str] = None
    projects: List[str] = []
    subscription: Subscription = Subscription()
    credits: float = 100.0  # Free starting credits
    totalCreditsUsed: float = 0.0
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)
    lastLogin: Optional[datetime] = None

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "name": "John Doe",
                "role": "user",
                "provider": "email"
            }
        }

class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    avatar: Optional[str] = None

class UserResponse(BaseModel):
    id: str = Field(alias="_id")
    email: str
    name: str
    avatar: Optional[str] = None
    role: str
    provider: str
    subscription: Subscription
    createdAt: datetime
    lastLogin: Optional[datetime] = None

    class Config:
        populate_by_name = True