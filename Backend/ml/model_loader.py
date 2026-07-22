import os
import pickle


# Project root directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load_model(model_name="logistic"):

    # Model directory
    MODEL_DIR = os.path.join(BASE_DIR, "model")

    # ===============================
    # Select model file
    # ===============================

    if model_name == "logistic":
        model_file = "logistic_model.pkl"

    elif model_name == "naive":
        model_file = "naive_model.pkl"

    elif model_name == "rf":
        model_file = "rf_model.pkl"

    else:
        model_file = "logistic_model.pkl"

    model_path = os.path.join(MODEL_DIR, model_file)

    # ===============================
    # File existence check
    # ===============================

    if not os.path.exists(model_path):
        raise FileNotFoundError(
            f"❌ {model_file} not found in /model folder. Train the model first."
        )

    try:

        # ===============================
        # Load full pipeline model
        # ===============================

        with open(model_path, "rb") as f:
            model = pickle.load(f)

    except Exception as e:
        raise RuntimeError(f"❌ Error loading model file: {str(e)}")

    # ===============================
    # Optional: load columns list
    # ===============================

    columns_path = os.path.join(MODEL_DIR, "columns.pkl")

    columns = None

    if os.path.exists(columns_path):

        try:
            with open(columns_path, "rb") as f:
                columns = pickle.load(f)

            print("✅ columns.pkl loaded")

        except:
            print("⚠ columns.pkl not loaded")

    # ===============================
    # Final validation
    # ===============================

    if model is None:
        raise ValueError("❌ Loaded model is None")

    print(f"✅ {model_file} loaded successfully")

    return model