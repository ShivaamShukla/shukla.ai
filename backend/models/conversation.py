from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class AgentMode(str, Enum):
    E1 = "e1"
    E1_1 = "e1.1"
    E2 = "e2"
    PROTOTYPE = "prototype"
    MOBILE = "mobile"

class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"

class FileAttachment(BaseModel):
    filename: str
    url: str
    size: int
    type: str
    uploadedAt: datetime = Field(default_factory=datetime.utcnow)

class GitHubRepo(BaseModel):
    url: str
    branch: str = "main"
    repo_type: str = "public"  # public or private
    access_token: Optional[str] = None

class Message(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    conversationId: str
    role: MessageRole
    content: str
    attachments: List[FileAttachment] = []
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: Dict[str, Any] = {}

    class Config:
        populate_by_name = True

class ConversationSettings(BaseModel):
    agentMode: AgentMode = AgentMode.E1
    ultraThinking: bool = False
    model: str = "claude-4.5-sonnet"
    mcpTools: List[str] = []
    template: Optional[str] = None
    maxTokens: int = 4096
    temperature: float = 0.7

class Conversation(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    userId: str
    projectName: str = "Untitled Project"
    settings: ConversationSettings = ConversationSettings()
    githubRepo: Optional[GitHubRepo] = None
    messages: List[str] = []  # Message IDs
    creditsUsed: float = 0.0
    status: str = "active"  # active, archived, deleted
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class ConversationCreate(BaseModel):
    projectName: str = "Untitled Project"
    settings: Optional[ConversationSettings] = None

class MessageCreate(BaseModel):
    conversationId: str
    content: str
    attachments: List[FileAttachment] = []
    settings: Optional[ConversationSettings] = None