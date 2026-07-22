import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("MONGO_URI not found in .env file")

client = MongoClient(MONGO_URI)

# Database
db = client["fake_review_db"]

# Collections
reviews_collection = db["reviews"]
users_collection = db["users"]
