from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from database.database import users_collection

auth_bp = Blueprint("auth_bp", __name__)


# =====================================
# 🔹 USER SIGNUP
# URL: /api/auth/signup
# =====================================
@auth_bp.route("/signup", methods=["POST", "OPTIONS"])
def signup():

    if request.method == "OPTIONS":
        return "", 200

    try:
        data = request.get_json(force=True)

        if not data:
            return jsonify({"message": "No data received"}), 400

        name = data.get("name", "").strip()
        email = data.get("email", "").strip().lower()
        password = data.get("password", "").strip()

        if not name or not email or not password:
            return jsonify({"message": "All fields are required"}), 400

        # Case-insensitive email check
        if users_collection.find_one({"email": email}):
            return jsonify({"message": "User already exists"}), 400

        hashed_password = generate_password_hash(password)

        new_user = {
            "name": name,
            "email": email,
            "password": hashed_password,
            "role": "user"
        }

        users_collection.insert_one(new_user)

        return jsonify({
            "message": "Signup successful"
        }), 201

    except Exception as e:
        print("Signup Error:", e)
        return jsonify({
            "message": "Internal server error",
            "details": str(e)
        }), 500


# =====================================
# 🔹 USER LOGIN
# URL: /api/auth/login
# =====================================
@auth_bp.route("/login", methods=["POST", "OPTIONS"])
def login():

    if request.method == "OPTIONS":
        return "", 200

    try:
        data = request.get_json(force=True)

        if not data:
            return jsonify({"message": "No data received"}), 400

        email = data.get("email", "").strip().lower()
        password = data.get("password", "").strip()

        if not email or not password:
            return jsonify({"message": "Email and password required"}), 400

        user = users_collection.find_one({"email": email})

        if not user or not check_password_hash(user["password"], password):
            return jsonify({"message": "Invalid email or password"}), 401

        # ✅ DO NOT send password
        return jsonify({
            "message": "Login successful",
            "user": {
                "id": str(user.get("_id")),
                "name": user.get("name"),
                "email": user.get("email"),
                "role": user.get("role", "user")
            }
        }), 200

    except Exception as e:
        print("Login Error:", e)
        return jsonify({
            "message": "Internal server error",
            "details": str(e)
        }), 500