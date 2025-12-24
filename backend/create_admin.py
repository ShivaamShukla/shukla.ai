"""
Script to create an initial admin user
Run: python create_admin.py
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from utils.auth import hash_password
from datetime import datetime
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def create_admin():
    # Connect to MongoDB
    mongo_url = os.environ.get('MONGO_URL')
    db_name = os.environ.get('DB_NAME', 'emergent_db')
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # Check if admin already exists
    admin = await db.users.find_one({"email": "admin@emergent.com"})
    
    if admin:
        print("✓ Admin user already exists!")
        print(f"  Email: admin@emergent.com")
        print(f"  Password: admin123")
        return
    
    # Create admin user
    admin_data = {
        "email": "admin@emergent.com",
        "name": "Admin User",
        "password": hash_password("admin123"),
        "role": "admin",
        "provider": "email",
        "avatar": None,
        "projects": [],
        "subscription": {
            "plan": "pro",
            "status": "active",
            "startDate": datetime.utcnow(),
            "endDate": None
        },
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
        "lastLogin": None
    }
    
    result = await db.users.insert_one(admin_data)
    print(f"✓ Admin user created successfully!")
    print(f"  Email: admin@emergent.com")
    print(f"  Password: admin123")
    print(f"  User ID: {result.inserted_id}")
    
    # Create a test user
    test_user = await db.users.find_one({"email": "test@example.com"})
    
    if not test_user:
        test_user_data = {
            "email": "test@example.com",
            "name": "Test User",
            "password": hash_password("test123"),
            "role": "user",
            "provider": "email",
            "avatar": None,
            "projects": [],
            "subscription": {
                "plan": "free",
                "status": "active",
                "startDate": datetime.utcnow(),
                "endDate": None
            },
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow(),
            "lastLogin": None
        }
        
        result = await db.users.insert_one(test_user_data)
        print(f"\n✓ Test user created successfully!")
        print(f"  Email: test@example.com")
        print(f"  Password: test123")
        print(f"  User ID: {result.inserted_id}")
    
    client.close()
    print("\nYou can now login with these credentials!")

if __name__ == "__main__":
    asyncio.run(create_admin())
