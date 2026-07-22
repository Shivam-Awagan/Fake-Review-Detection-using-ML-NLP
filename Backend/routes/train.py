from flask import Blueprint, request, jsonify
import os
from ml.train_model import train_model   # ✅ Correct import

train_bp = Blueprint("train_bp", __name__)

# ✅ Rename route function to avoid name conflict
@train_bp.route("/train-model", methods=["POST"])
def train_model_route():

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "Empty file name"}), 400

    # ✅ Save dataset inside ml folder
    save_path = os.path.join("ml", "dataset.csv")
    file.save(save_path)

    try:
        # ✅ Call correct function name
        accuracy = train_model(save_path)

        return jsonify({
            "message": "Model trained successfully",
            "accuracy": accuracy
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
