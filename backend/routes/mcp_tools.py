from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from models.mcp_tool import MCPTool, MCPToolCreate, UserMCPConfig
from utils.auth import get_current_user, get_current_admin
from database import db
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/api/mcp-tools", tags=["mcp-tools"])

@router.get("/", response_model=List[MCPTool])
async def get_mcp_tools(current_user: dict = Depends(get_current_user)):
    """Get all enabled MCP tools"""
    tools = await db.mcp_tools.find({"enabled": True}).to_list(1000)
    for tool in tools:
        tool["_id"] = str(tool["_id"])
    return [MCPTool(**tool) for tool in tools]

@router.get("/all", response_model=List[MCPTool])
async def get_all_mcp_tools(current_admin: dict = Depends(get_current_admin)):
    """Get all MCP tools (admin only)"""
    tools = await db.mcp_tools.find().to_list(1000)
    for tool in tools:
        tool["_id"] = str(tool["_id"])
    return [MCPTool(**tool) for tool in tools]

@router.post("/", response_model=MCPTool)
async def create_mcp_tool(data: MCPToolCreate, current_admin: dict = Depends(get_current_admin)):
    """Create a new MCP tool (admin only)"""
    tool = MCPTool(**data.model_dump())
    tool_dict = tool.model_dump(by_alias=True, exclude={"id"})
    result = await db.mcp_tools.insert_one(tool_dict)
    tool_dict["_id"] = str(result.inserted_id)
    return MCPTool(**tool_dict)

@router.put("/{tool_id}/toggle")
async def toggle_mcp_tool(tool_id: str, enabled: bool, current_admin: dict = Depends(get_current_admin)):
    """Enable/disable an MCP tool (admin only)"""
    try:
        result = await db.mcp_tools.update_one(
            {"_id": ObjectId(tool_id)},
            {"$set": {"enabled": enabled, "updatedAt": datetime.utcnow()}}
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid tool ID")
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Tool not found")
    
    return {"message": f"Tool {'enabled' if enabled else 'disabled'} successfully"}

@router.delete("/{tool_id}")
async def delete_mcp_tool(tool_id: str, current_admin: dict = Depends(get_current_admin)):
    """Delete an MCP tool (admin only)"""
    try:
        result = await db.mcp_tools.delete_one({"_id": ObjectId(tool_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid tool ID")
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Tool not found")
    
    return {"message": "Tool deleted successfully"}

# User MCP configurations
@router.get("/user-config", response_model=List[UserMCPConfig])
async def get_user_mcp_configs(current_user: dict = Depends(get_current_user)):
    """Get user's MCP tool configurations"""
    configs = await db.user_mcp_configs.find({"userId": current_user["id"]}).to_list(1000)
    for config in configs:
        config["_id"] = str(config["_id"])
    return [UserMCPConfig(**config) for config in configs]

@router.post("/user-config")
async def save_user_mcp_config(
    mcpToolId: str,
    apiKey: str = None,
    config: dict = {},
    current_user: dict = Depends(get_current_user)
):
    """Save user's MCP tool configuration"""
    # Check if config already exists
    existing = await db.user_mcp_configs.find_one({
        "userId": current_user["id"],
        "mcpToolId": mcpToolId
    })
    
    if existing:
        # Update existing config
        await db.user_mcp_configs.update_one(
            {"_id": existing["_id"]},
            {"$set": {
                "apiKey": apiKey,
                "config": config,
                "updatedAt": datetime.utcnow()
            }}
        )
    else:
        # Create new config
        user_config = UserMCPConfig(
            userId=current_user["id"],
            mcpToolId=mcpToolId,
            apiKey=apiKey,
            config=config
        )
        await db.user_mcp_configs.insert_one(user_config.model_dump(by_alias=True, exclude={"id"}))
    
    return {"message": "Configuration saved successfully"}