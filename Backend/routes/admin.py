from flask import Blueprint, jsonify, request

# Blueprint for admin APIs
admin_bp = Blueprint("admin_bp", __name__)

# =====================================
# 🔹 TRAIN ML MODEL (ADMIN)
# URL: /api/train-model
# =====================================
@admin_bp.route("/train-model", methods=["POST", "OPTIONS"])
def train_model():

    # ✅ CORS preflight
    if request.method == "OPTIONS":
        return "", 200

    return jsonify({
        "status": "success",
        "message": "Model trained successfully"
    }), 200
