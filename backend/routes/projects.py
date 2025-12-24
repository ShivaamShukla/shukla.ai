from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from models.project import Project, ProjectCreate, ProjectUpdate, ProjectStatus
from models.activity import ActivityCreate
from utils.auth import get_current_user
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/api/projects", tags=["projects"])

# Database will be injected from main app
from server import db

@router.get("/", response_model=List[Project])
async def get_user_projects(current_user: dict = Depends(get_current_user)):
    """Get all projects for the current user"""
    projects = await db.projects.find({"userId": current_user["id"]}).to_list(1000)
    for project in projects:
        project["_id"] = str(project["_id"])
    return [Project(**project) for project in projects]

@router.post("/", response_model=Project)
async def create_project(project_data: ProjectCreate, current_user: dict = Depends(get_current_user)):
    """Create a new project"""
    # Check user's subscription limits
    user = await db.users.find_one({"_id": ObjectId(current_user["id"])})
    user_projects = await db.projects.count_documents({"userId": current_user["id"]})
    
    subscription_limits = {
        "free": 3,
        "standard": 10,
        "pro": float('inf')
    }
    
    plan = user.get("subscription", {}).get("plan", "free")
    limit = subscription_limits.get(plan, 3)
    
    if user_projects >= limit:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Project limit reached for {plan} plan. Upgrade to create more projects."
        )
    
    # Create project
    project = Project(
        userId=current_user["id"],
        name=project_data.name,
        description=project_data.description,
        type=project_data.type,
        status=ProjectStatus.DRAFT
    )
    
    project_dict = project.model_dump(by_alias=True, exclude={"id"})
    result = await db.projects.insert_one(project_dict)
    
    # Log activity
    activity = ActivityCreate(
        userId=current_user["id"],
        action="create",
        resource="project",
        metadata={"projectId": str(result.inserted_id), "projectName": project.name}
    )
    await db.activities.insert_one(activity.model_dump())
    
    project_dict["_id"] = str(result.inserted_id)
    return Project(**project_dict)

@router.get("/{project_id}", response_model=Project)
async def get_project(project_id: str, current_user: dict = Depends(get_current_user)):
    """Get a specific project"""
    try:
        project = await db.projects.find_one({"_id": ObjectId(project_id)})
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid project ID"
        )
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check if user owns the project
    if project["userId"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this project"
        )
    
    project["_id"] = str(project["_id"])
    return Project(**project)

@router.put("/{project_id}", response_model=Project)
async def update_project(
    project_id: str,
    project_update: ProjectUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update a project"""
    try:
        project = await db.projects.find_one({"_id": ObjectId(project_id)})
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid project ID"
        )
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    if project["userId"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this project"
        )
    
    # Update project
    update_data = project_update.model_dump(exclude_unset=True)
    update_data["updatedAt"] = datetime.utcnow()
    
    await db.projects.update_one(
        {"_id": ObjectId(project_id)},
        {"$set": update_data}
    )
    
    # Log activity
    activity = ActivityCreate(
        userId=current_user["id"],
        action="update",
        resource="project",
        metadata={"projectId": project_id, "updates": update_data}
    )
    await db.activities.insert_one(activity.model_dump())
    
    updated_project = await db.projects.find_one({"_id": ObjectId(project_id)})
    updated_project["_id"] = str(updated_project["_id"])
    return Project(**updated_project)

@router.delete("/{project_id}")
async def delete_project(project_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a project"""
    try:
        project = await db.projects.find_one({"_id": ObjectId(project_id)})
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid project ID"
        )
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    if project["userId"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this project"
        )
    
    await db.projects.delete_one({"_id": ObjectId(project_id)})
    
    # Log activity
    activity = ActivityCreate(
        userId=current_user["id"],
        action="delete",
        resource="project",
        metadata={"projectId": project_id, "projectName": project.get("name")}
    )
    await db.activities.insert_one(activity.model_dump())
    
    return {"message": "Project deleted successfully"}

@router.post("/{project_id}/deploy")
async def deploy_project(project_id: str, current_user: dict = Depends(get_current_user)):
    """Deploy a project (mock implementation)"""
    try:
        project = await db.projects.find_one({"_id": ObjectId(project_id)})
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid project ID"
        )
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    if project["userId"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to deploy this project"
        )
    
    # Mock deployment - update status
    deployment_url = f"https://{project['name'].lower().replace(' ', '-')}.emergent-app.com"
    
    await db.projects.update_one(
        {"_id": ObjectId(project_id)},
        {"$set": {
            "status": ProjectStatus.DEPLOYED,
            "url": deployment_url,
            "updatedAt": datetime.utcnow()
        }}
    )
    
    # Log activity
    activity = ActivityCreate(
        userId=current_user["id"],
        action="deploy",
        resource="project",
        metadata={"projectId": project_id, "url": deployment_url}
    )
    await db.activities.insert_one(activity.model_dump())
    
    return {
        "message": "Project deployed successfully",
        "url": deployment_url,
        "status": ProjectStatus.DEPLOYED
    }