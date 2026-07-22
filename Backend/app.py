from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

from routes.review import review_bp
from routes.admin import admin_bp
from routes.auth import auth_bp
from routes.train import train_bp

# =========================
# LOAD ENV VARIABLES
# =========================
load_dotenv()

app = Flask(__name__)

# =========================
# ENABLE CORS
# =========================
CORS(app)


# =========================
# REGISTER BLUEPRINTS
# =========================

# review routes
app.register_blueprint(review_bp, url_prefix="/api/review")

# admin routes
app.register_blueprint(admin_bp, url_prefix="/api")

# auth routes
app.register_blueprint(auth_bp, url_prefix="/api/auth")

# train routes (if used)
app.register_blueprint(train_bp, url_prefix="/api")


# =========================
# HOME ROUTE
# =========================
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "running",
        "message": "Advanced Fake Review Detection Backend is running"
    })


# =========================
# HEALTH CHECK
# =========================
@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "server": "ok",
        "ml_model": "ready",
        "environment": os.getenv("FLASK_ENV", "development")
    })


# =========================
# START SERVER
# =========================
if __name__ == "__main__":

    print("\n===== BACKEND STARTED =====")
    print("Training API → /api/review/train-model")
    print("Text API → /api/review/analyze-text")
    print("URL API → /api/review/analyze-url\n")

    app.run(
        host="0.0.0.0",
        port=int(os.getenv("PORT", 5000)),
        debug=True,          # ✅ enable terminal output
        use_reloader=False   # ✅ avoid double run
    )