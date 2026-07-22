from flask import Blueprint, request, jsonify
import os
import pandas as pd
import pickle

from ml.model_loader import load_model
from ml.train_model import train_model
from services.selenium_review_scraper import extract_reviews_from_url

review_bp = Blueprint("review_bp", __name__)


# ===============================
# PATH SETUP
# ===============================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "model")

columns_path = os.path.join(MODEL_DIR, "columns.pkl")

columns = None

if os.path.exists(columns_path):

    with open(columns_path, "rb") as f:
        columns = pickle.load(f)

    print("✅ columns loaded:", columns)


# =================================================
# LOAD MODEL
# =================================================

def get_model(model_name="logistic"):

    if model_name is None or model_name == "":
        model_name = "logistic"

    try:
        model = load_model(model_name)
        return model

    except Exception as e:
        print("Model load error:", e)
        return None


# =================================================
# TRAIN MODEL
# =================================================

@review_bp.route("/train-model", methods=["POST"])
def train_model_from_csv():

    print("\n===== TRAIN API CALLED =====")

    if "file" not in request.files:
        return jsonify({"error": "CSV file required"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No file"}), 400

    dataset_path = os.path.join(os.getcwd(), "uploaded_dataset.csv")

    file.save(dataset_path)

    try:

        result = train_model(dataset_path)

        return jsonify({
            "message": "Model trained",
            "details": result
        }), 200

    except Exception as e:

        print("Training error:", e)

        return jsonify({
            "error": str(e)
        }), 500


# =================================================
# TEXT ANALYSIS
# =================================================

@review_bp.route("/analyze-text", methods=["POST", "OPTIONS"])
def analyze_text():

    if request.method == "OPTIONS":
        return "", 200

    try:

        data = request.get_json(force=True) or {}

        text = data.get("text", "").strip()

        model_name = data.get("model", "logistic")

        if not text:
            return jsonify({"error": "Empty text"}), 400

        model = get_model(model_name)

        if model is None:
            return jsonify({"error": "Model not loaded"}), 500


        # ===============================
        # DYNAMIC INPUT
        # ===============================

        data_dict = {}

        if columns:

            for col in columns:

                if col == "review":
                    data_dict[col] = text

                elif col == "category":
                    data_dict[col] = "unknown"

                elif col == "rating":
                    data_dict[col] = 5

                else:
                    data_dict[col] = ""

        else:

            data_dict = {
                "review": text,
                "category": "unknown",
                "rating": 5
            }

        input_df = pd.DataFrame([data_dict])


        # ✅ FIXED PREDICTION

        if hasattr(model, "predict_proba"):

            prob = model.predict_proba(input_df)[0]

            confidence = round(float(max(prob)) * 100, 2)

            if len(text) < 6:
                prediction = 0
            else:
                prediction = 1 if prob[1] >= 0.8 else 0

            # ❌ REMOVE overwrite
            # prediction = model.predict(input_df)[0]
            # confidence = None


        return jsonify({
            "prediction": "Genuine" if prediction == 1 else "Fake",
            "confidence": confidence,
            "model": model_name
        })


    except Exception as e:

        print("Analyze error:", e)

        return jsonify({
            "error": str(e)
        }), 500


# =================================================
# URL ANALYSIS
# =================================================

@review_bp.route("/analyze-url", methods=["POST", "OPTIONS"])
def analyze_url():

    if request.method == "OPTIONS":
        return "", 200

    try:

        data = request.get_json(force=True) or {}

        url = data.get("url", "")

        model_name = data.get("model", "logistic")

        if not url:
            return jsonify({"error": "URL required"}), 400

        model = get_model(model_name)

        if model is None:
            return jsonify({"error": "Model not loaded"}), 500


        reviews = extract_reviews_from_url(url)

        results = []

        fake = 0
        genuine = 0


        for text in reviews:

            data_dict = {}

            if columns:

                for col in columns:

                    if col == "review":
                        data_dict[col] = text

                    elif col == "category":
                        data_dict[col] = "unknown"

                    elif col == "rating":
                        data_dict[col] = 5

                    else:
                        data_dict[col] = ""

            else:

                data_dict = {
                    "review": text,
                    "category": "unknown",
                    "rating": 5
                }

            input_df = pd.DataFrame([data_dict])


            if hasattr(model, "predict_proba"):

                prob = model.predict_proba(input_df)[0]

                conf = round(float(max(prob)) * 100, 2)

                if len(text) < 6:
                    prediction = 0
                else:
                    prediction = 1 if prob[1] >= 0.8 else 0

            else:

                prediction = model.predict(input_df)[0]
                conf = None


            label = "genuine" if prediction == 1 else "fake"

            if label == "fake":
                fake += 1
            else:
                genuine += 1

            results.append({
                "text": text,
                "label": label,
                "confidence": conf
            })

            # ===============================
            # AVG CONFIDENCE CALCULATION
            # ===============================

            total_conf = 0
            count_conf = 0

            for r in results:
                if r["confidence"] is not None:
                    total_conf += r["confidence"]
                    count_conf += 1
            avg_conf = 0   

            if count_conf > 0:
                avg_conf = round(total_conf / count_conf, 2)
        return jsonify({

            "total_reviews": len(reviews),
            "fake": fake,
            "genuine": genuine,
            "avg_confidence": avg_conf,
            "reviews": results
            
        })


    except Exception as e:

        print("URL error:", e)

        return jsonify({
            "error": str(e)
        }), 500