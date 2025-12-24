from pydantic import BaseModel, Field
from typing import Optional, Dict, List
from datetime import datetime

class MCPTool(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    name: str
    displayName: str
    description: str
    type: str  # memory, supabase, notion, custom
    requiresApiKey: bool = False
    enabled: bool = True
    icon: str = "🔧"
    configSchema: Dict = {}  # JSON schema for configuration
    endpoint: Optional[str] = None  # For custom MCP
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class MCPToolCreate(BaseModel):
    name: str
    displayName: str
    description: str
    type: str
    requiresApiKey: bool = False
    enabled: bool = True
    icon: str = "🔧"
    configSchema: Optional[Dict] = None
    endpoint: Optional[str] = None

class UserMCPConfig(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    userId: str
    mcpToolId: str
    apiKey: Optional[str] = None
    config: Dict = {}
    enabled: bool = True
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True