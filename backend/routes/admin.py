from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Dict
from models.user import UserResponse, UserRole
from models.project import Project
from models.activity import Activity
from utils.auth import get_current_admin
from bson import ObjectId
from datetime import datetime, timedelta
from database import db

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.get("/users", response_model=List[UserResponse])
async def get_all_users(current_admin: dict = Depends(get_current_admin)):
    """Get all users (admin only)"""
    users = await db.users.find().to_list(1000)
    for user in users:
        user["_id"] = str(user["_id"])
    return [UserResponse(**user) for user in users]

@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user_by_id(user_id: str, current_admin: dict = Depends(get_current_admin)):
    """Get user by ID (admin only)"""
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID"
        )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user["_id"] = str(user["_id"])
    return UserResponse(**user)

@router.put("/users/{user_id}/role")
async def update_user_role(
    user_id: str,
    role: UserRole,
    current_admin: dict = Depends(get_current_admin)
):
    """Update user role (admin only)"""
    try:
        result = await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"role": role, "updatedAt": datetime.utcnow()}}
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID"
        )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {"message": f"User role updated to {role}"}

@router.delete("/users/{user_id}")
async def delete_user(user_id: str, current_admin: dict = Depends(get_current_admin)):
    """Delete user (admin only)"""
    try:
        # Delete user's projects first
        await db.projects.delete_many({"userId": user_id})
        
        # Delete user
        result = await db.users.delete_one({"_id": ObjectId(user_id)})
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID"
        )
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {"message": "User and associated projects deleted successfully"}

@router.get("/projects", response_model=List[Project])
async def get_all_projects(current_admin: dict = Depends(get_current_admin)):
    """Get all projects (admin only)"""
    projects = await db.projects.find().to_list(1000)
    for project in projects:
        project["_id"] = str(project["_id"])
    return [Project(**project) for project in projects]

@router.get("/stats")
async def get_system_stats(current_admin: dict = Depends(get_current_admin)):
    """Get system statistics (admin only)"""
    # Count users
    total_users = await db.users.count_documents({})
    active_users = await db.users.count_documents({
        "lastLogin": {"$gte": datetime.utcnow() - timedelta(days=30)}
    })
    
    # Count projects by status
    total_projects = await db.projects.count_documents({})
    deployed_projects = await db.projects.count_documents({"status": "deployed"})
    building_projects = await db.projects.count_documents({"status": "building"})
    draft_projects = await db.projects.count_documents({"status": "draft"})
    
    # Count users by subscription
    free_users = await db.users.count_documents({"subscription.plan": "free"})
    standard_users = await db.users.count_documents({"subscription.plan": "standard"})
    pro_users = await db.users.count_documents({"subscription.plan": "pro"})
    
    # Recent activities
    recent_activities = await db.activities.find().sort("timestamp", -1).limit(10).to_list(10)
    for activity in recent_activities:
        activity["_id"] = str(activity["_id"])
    
    return {
        "users": {
            "total": total_users,
            "active": active_users,
            "bySubscription": {
                "free": free_users,
                "standard": standard_users,
                "pro": pro_users
            }
        },
        "projects": {
            "total": total_projects,
            "deployed": deployed_projects,
            "building": building_projects,
            "draft": draft_projects
        },
        "recentActivities": recent_activities
    }

@router.get("/activities", response_model=List[Activity])
async def get_activities(
    limit: int = 100,
    current_admin: dict = Depends(get_current_admin)
):
    """Get activity logs (admin only)"""
    activities = await db.activities.find().sort("timestamp", -1).limit(limit).to_list(limit)
    for activity in activities:
        activity["_id"] = str(activity["_id"])
    return [Activity(**activity) for activity in activities]
