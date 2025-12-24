from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from models.ai_model import AIModel, ModelCreate, ModelUpdate
from utils.auth import get_current_user, get_current_admin
from database import db
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/api/models", tags=["models"])

@router.get("/", response_model=List[AIModel])
async def get_models(current_user: dict = Depends(get_current_user)):
    """Get all enabled AI models"""
    models = await db.ai_models.find({"enabled": True}).to_list(1000)
    for model in models:
        model["_id"] = str(model["_id"])
    return [AIModel(**model) for model in models]

@router.get("/all", response_model=List[AIModel])
async def get_all_models(current_admin: dict = Depends(get_current_admin)):
    """Get all AI models (admin only)"""
    models = await db.ai_models.find().to_list(1000)
    for model in models:
        model["_id"] = str(model["_id"])
    return [AIModel(**model) for model in models]

@router.post("/", response_model=AIModel)
async def create_model(data: ModelCreate, current_admin: dict = Depends(get_current_admin)):
    """Create a new AI model (admin only)"""
    model = AIModel(**data.model_dump())
    model_dict = model.model_dump(by_alias=True, exclude={"id"})
    result = await db.ai_models.insert_one(model_dict)
    model_dict["_id"] = str(result.inserted_id)
    return AIModel(**model_dict)

@router.put("/{model_id}", response_model=AIModel)
async def update_model(
    model_id: str,
    data: ModelUpdate,
    current_admin: dict = Depends(get_current_admin)
):
    """Update an AI model (admin only)"""
    update_data = data.model_dump(exclude_unset=True)
    update_data["updatedAt"] = datetime.utcnow()
    
    try:
        result = await db.ai_models.update_one(
            {"_id": ObjectId(model_id)},
            {"$set": update_data}
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid model ID")
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Model not found")
    
    model = await db.ai_models.find_one({"_id": ObjectId(model_id)})
    model["_id"] = str(model["_id"])
    return AIModel(**model)

@router.delete("/{model_id}")
async def delete_model(model_id: str, current_admin: dict = Depends(get_current_admin)):
    """Delete an AI model (admin only)"""
    try:
        result = await db.ai_models.delete_one({"_id": ObjectId(model_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid model ID")
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Model not found")
    
    return {"message": "Model deleted successfully"}