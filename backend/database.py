from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', '')
db_name = os.environ.get('DB_NAME', 'emergent_db')

if not mongo_url:
    raise ValueError("MONGO_URL environment variable is not set")

client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

def get_database():
    return db
