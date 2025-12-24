"""
Script to initialize default AI models and MCP tools
Run: python init_defaults.py
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def init_defaults():
    # Connect to MongoDB
    mongo_url = os.environ.get('MONGO_URL')
    db_name = os.environ.get('DB_NAME', 'emergent_db')
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # Default AI Models
    models = [
        {
            "name": "claude-4.5-sonnet",
            "displayName": "Claude 4.5 Sonnet",
            "provider": "anthropic",
            "maxTokens": 200000,
            "pricePerThousandTokens": 0.003,
            "enabled": True,
            "description": "Most balanced model for general use",
            "capabilities": {
                "vision": True,
                "function_calling": True,
                "streaming": True
            },
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "name": "claude-4.5-opus",
            "displayName": "Claude 4.5 Opus",
            "provider": "anthropic",
            "maxTokens": 200000,
            "pricePerThousandTokens": 0.015,
            "enabled": True,
            "description": "Most powerful model for complex tasks",
            "capabilities": {
                "vision": True,
                "function_calling": True,
                "streaming": True
            },
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "name": "claude-sonnet-1m",
            "displayName": "Claude Sonnet 1M",
            "provider": "anthropic",
            "maxTokens": 1000000,
            "pricePerThousandTokens": 0.003,
            "enabled": True,
            "description": "Extended context window for large codebases",
            "capabilities": {
                "vision": False,
                "function_calling": True,
                "streaming": True
            },
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "name": "gpt-5.2",
            "displayName": "GPT-5.2",
            "provider": "openai",
            "maxTokens": 128000,
            "pricePerThousandTokens": 0.010,
            "enabled": True,
            "description": "OpenAI's most advanced model",
            "capabilities": {
                "vision": True,
                "function_calling": True,
                "streaming": True
            },
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "name": "gpt-5.1",
            "displayName": "GPT-5.1",
            "provider": "openai",
            "maxTokens": 128000,
            "pricePerThousandTokens": 0.008,
            "enabled": True,
            "description": "Fast and cost-effective",
            "capabilities": {
                "vision": True,
                "function_calling": True,
                "streaming": True
            },
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "name": "gemini-3-pro",
            "displayName": "Gemini 3 Pro",
            "provider": "google",
            "maxTokens": 2000000,
            "pricePerThousandTokens": 0.002,
            "enabled": True,
            "description": "Google's most capable model with massive context",
            "capabilities": {
                "vision": True,
                "function_calling": True,
                "streaming": True
            },
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
    ]
    
    # Check if models already exist
    existing_models = await db.ai_models.count_documents({})
    if existing_models > 0:
        print(f"✓ {existing_models} AI models already exist")
    else:
        await db.ai_models.insert_many(models)
        print(f"✓ Created {len(models)} default AI models")
    
    # Default MCP Tools
    mcp_tools = [
        {
            "name": "memory",
            "displayName": "Memory MCP",
            "description": "Stores conversation memory and context across sessions",
            "type": "memory",
            "requiresApiKey": False,
            "enabled": True,
            "icon": "🧠",
            "configSchema": {},
            "endpoint": None,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "name": "supabase",
            "displayName": "Supabase MCP",
            "description": "Connect to Supabase for database operations",
            "type": "supabase",
            "requiresApiKey": True,
            "enabled": True,
            "icon": "🗄️",
            "configSchema": {
                "type": "object",
                "properties": {
                    "apiKey": {"type": "string", "description": "Supabase API Key"},
                    "projectUrl": {"type": "string", "description": "Supabase Project URL"}
                },
                "required": ["apiKey", "projectUrl"]
            },
            "endpoint": None,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "name": "notion",
            "displayName": "Notion MCP",
            "description": "Read and write pages in Notion workspace",
            "type": "notion",
            "requiresApiKey": True,
            "enabled": True,
            "icon": "📝",
            "configSchema": {
                "type": "object",
                "properties": {
                    "apiKey": {"type": "string", "description": "Notion Integration Token"},
                    "databaseId": {"type": "string", "description": "Default Database ID"}
                },
                "required": ["apiKey"]
            },
            "endpoint": None,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "name": "custom",
            "displayName": "Custom MCP Server",
            "description": "Connect to your own custom MCP server",
            "type": "custom",
            "requiresApiKey": False,
            "enabled": True,
            "icon": "🔧",
            "configSchema": {
                "type": "object",
                "properties": {
                    "endpoint": {"type": "string", "description": "Custom MCP Server Endpoint"}
                },
                "required": ["endpoint"]
            },
            "endpoint": None,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
    ]
    
    # Check if MCP tools already exist
    existing_tools = await db.mcp_tools.count_documents({})
    if existing_tools > 0:
        print(f"✓ {existing_tools} MCP tools already exist")
    else:
        await db.mcp_tools.insert_many(mcp_tools)
        print(f"✓ Created {len(mcp_tools)} default MCP tools")
    
    client.close()
    print("\n✅ Initialization complete!")

if __name__ == "__main__":
    asyncio.run(init_defaults())
