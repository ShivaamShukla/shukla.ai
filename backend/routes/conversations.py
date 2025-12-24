from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File
from typing import List
from models.conversation import Conversation, ConversationCreate, Message, MessageCreate, MessageRole
from models.credits import CreditTransaction
from utils.auth import get_current_user
from database import db
from bson import ObjectId
from datetime import datetime
import uuid

router = APIRouter(prefix="/api/conversations", tags=["conversations"])

@router.get("/", response_model=List[Conversation])
async def get_conversations(current_user: dict = Depends(get_current_user)):
    """Get all conversations for current user"""
    conversations = await db.conversations.find({"userId": current_user["id"]}).sort("updatedAt", -1).to_list(1000)
    for conv in conversations:
        conv["_id"] = str(conv["_id"])
    return [Conversation(**conv) for conv in conversations]

@router.post("/", response_model=Conversation)
async def create_conversation(data: ConversationCreate, current_user: dict = Depends(get_current_user)):
    """Create a new conversation"""
    conversation = Conversation(
        userId=current_user["id"],
        projectName=data.projectName,
        settings=data.settings if data.settings else None
    )
    
    conv_dict = conversation.model_dump(by_alias=True, exclude={"id"})
    result = await db.conversations.insert_one(conv_dict)
    
    conv_dict["_id"] = str(result.inserted_id)
    return Conversation(**conv_dict)

@router.get("/{conversation_id}", response_model=Conversation)
async def get_conversation(conversation_id: str, current_user: dict = Depends(get_current_user)):
    """Get a specific conversation"""
    try:
        conversation = await db.conversations.find_one({"_id": ObjectId(conversation_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid conversation ID")
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    if conversation["userId"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    conversation["_id"] = str(conversation["_id"])
    return Conversation(**conversation)

@router.get("/{conversation_id}/messages", response_model=List[Message])
async def get_messages(conversation_id: str, current_user: dict = Depends(get_current_user)):
    """Get all messages for a conversation"""
    # Verify conversation ownership
    try:
        conversation = await db.conversations.find_one({"_id": ObjectId(conversation_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid conversation ID")
    
    if not conversation or conversation["userId"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    messages = await db.messages.find({"conversationId": conversation_id}).sort("timestamp", 1).to_list(1000)
    for msg in messages:
        msg["_id"] = str(msg["_id"])
    return [Message(**msg) for msg in messages]

@router.post("/messages", response_model=Message)
async def send_message(data: MessageCreate, current_user: dict = Depends(get_current_user)):
    """Send a message in a conversation"""
    # Verify conversation ownership
    try:
        conversation = await db.conversations.find_one({"_id": ObjectId(data.conversationId)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid conversation ID")
    
    if not conversation or conversation["userId"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Check user credits
    user = await db.users.find_one({"_id": ObjectId(current_user["id"])})
    if user.get("credits", 0) < 0.1:
        raise HTTPException(status_code=402, detail="Insufficient credits")
    
    # Create user message
    user_message = Message(
        conversationId=data.conversationId,
        role=MessageRole.USER,
        content=data.content,
        attachments=data.attachments
    )
    
    msg_dict = user_message.model_dump(by_alias=True, exclude={"id"})
    result = await db.messages.insert_one(msg_dict)
    msg_dict["_id"] = str(result.inserted_id)
    
    # Update conversation settings if provided
    if data.settings:
        await db.conversations.update_one(
            {"_id": ObjectId(data.conversationId)},
            {"$set": {"settings": data.settings.model_dump(), "updatedAt": datetime.utcnow()}}
        )
    
    # Mock AI response for now
    ai_response = Message(
        conversationId=data.conversationId,
        role=MessageRole.ASSISTANT,
        content=f"I understand you want to build: {data.content[:100]}... I'm processing your request with the selected model and settings."
    )
    
    ai_dict = ai_response.model_dump(by_alias=True, exclude={"id"})
    ai_result = await db.messages.insert_one(ai_dict)
    
    # Deduct credits (mock calculation)
    credits_used = 0.5
    await db.users.update_one(
        {"_id": ObjectId(current_user["id"])},
        {
            "$inc": {"credits": -credits_used, "totalCreditsUsed": credits_used},
            "$set": {"updatedAt": datetime.utcnow()}
        }
    )
    
    # Log credit transaction
    transaction = CreditTransaction(
        userId=current_user["id"],
        amount=-credits_used,
        type="debit",
        description="Message sent",
        conversationId=data.conversationId
    )
    await db.credit_transactions.insert_one(transaction.model_dump(by_alias=True, exclude={"id"}))
    
    return Message(**msg_dict)

@router.delete("/{conversation_id}")
async def delete_conversation(conversation_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a conversation"""
    try:
        conversation = await db.conversations.find_one({"_id": ObjectId(conversation_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid conversation ID")
    
    if not conversation or conversation["userId"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Delete all messages
    await db.messages.delete_many({"conversationId": conversation_id})
    
    # Delete conversation
    await db.conversations.delete_one({"_id": ObjectId(conversation_id)})
    
    return {"message": "Conversation deleted successfully"}