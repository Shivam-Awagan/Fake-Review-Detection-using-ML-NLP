import os
import sys
import pandas as pd
import pickle

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.ensemble import RandomForestClassifier

from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler, MinMaxScaler
from sklearn.feature_extraction.text import TfidfVectorizer

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)


def train_model(dataset_path=None):

    if dataset_path is None:
        dataset_path = os.path.join(BASE_DIR, "dataset.csv")

    if not os.path.exists(dataset_path):
        raise FileNotFoundError("Dataset file not found")

    df = pd.read_csv(
        dataset_path,
        sep=",",
        engine="python",
        on_bad_lines="skip",
        encoding="utf-8"
    )

    df.dropna(how="all", inplace=True)

    df.columns = df.columns.str.strip().str.lower()

    print("Detected Columns:", df.columns.tolist())

    # rename columns
    if "text_" in df.columns:
        df.rename(columns={"text_": "review"}, inplace=True)

    if "class" in df.columns:
        df.rename(columns={"class": "label"}, inplace=True)

    if "type" in df.columns:
        df.rename(columns={"type": "label"}, inplace=True)

    if "output" in df.columns:
        df.rename(columns={"output": "label"}, inplace=True)

    if "label" not in df.columns:
        raise ValueError("Dataset must contain label column")

    # -------------------------
    # FIX LABEL
    # -------------------------

    df["label"] = df["label"].astype(str).str.upper().str.strip()

    df["label"] = df["label"].replace({

        "OR": 1,
        "CG": 0,

        "GENUINE": 1,
        "FAKE": 0,

        "REAL": 1,
        "SPAM": 0,

        "GOOD": 1,
        "BAD": 0,

        "POSITIVE": 1,
        "NEGATIVE": 0,

        "1": 1,
        "0": 0,
        "1.0": 1,
        "0.0": 0,

        "TRUE": 1,
        "FALSE": 0
    })

    df["label"] = pd.to_numeric(df["label"], errors="coerce")

    df = df[df["label"].isin([0, 1])]

    df = df.fillna("")

    print("Unique labels:", df["label"].unique())
    print("Label counts:\n", df["label"].value_counts())
    
    # ✅ update added
    if df["label"].value_counts().min() < 5:
        print("WARNING: Dataset imbalanced, model may predict Genuine more")

    if df.empty:
        raise ValueError("Dataset empty after mapping")

    y = df["label"]
    X = df.drop(columns=["label"])

    # -------------------------
    # detect column types
    # -------------------------

    text_columns = []
    numeric_columns = []
    categorical_columns = []

    for col in X.columns:

        if pd.api.types.is_numeric_dtype(X[col]):
            numeric_columns.append(col)
            continue

        if X[col].dtype == "object":

            avg_length = X[col].astype(str).str.len().mean()

            if avg_length > 30:
                text_columns.append(col)
            else:
                categorical_columns.append(col)

        else:
            numeric_columns.append(col)

    if "review" in X.columns and "review" not in text_columns:
        text_columns.append("review")

    if "category" in text_columns:
        text_columns.remove("category")
        categorical_columns.append("category")

    print("Text Columns:", text_columns)
    print("Numeric Columns:", numeric_columns)
    print("Categorical Columns:", categorical_columns)

    transformers = []

    for col in text_columns:
        transformers.append(
            (f"tfidf_{col}", TfidfVectorizer(max_features=5000), col)
        )

    # ✅ ONLY CHANGE HERE
    if numeric_columns:
        transformers.append(
            ("num", MinMaxScaler(), numeric_columns)
        )

    if categorical_columns:
        transformers.append(
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_columns)
        )

    preprocessor = ColumnTransformer(transformers)

    # -------------------------
    # SAFE SPLIT FIX
    # -------------------------

    if len(df) < 5:

        print("Dataset too small, using full data")

        X_train = X
        y_train = y

        X_test = X
        y_test = y

    elif len(y.unique()) < 2 or min(y.value_counts()) < 2:

        X_train, X_test, y_train, y_test = train_test_split(
            X,
            y,
            test_size=0.2,
            random_state=42
        )

    else:

        X_train, X_test, y_train, y_test = train_test_split(
            X,
            y,
            test_size=0.2,
            random_state=42,
            stratify=y
        )

    MODEL_DIR = os.path.join(BASE_DIR, "model")
    os.makedirs(MODEL_DIR, exist_ok=True)

    # -------------------------
    # Logistic
    # -------------------------

    log_pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", LogisticRegression(
        max_iter=10000,
        class_weight="balanced",
        solver="liblinear",
        C=0.3
    ))
])
    log_pipeline.fit(X_train, y_train)
    pred1 = log_pipeline.predict(X_test)

    print("\n===== Logistic Regression =====")
    print("Accuracy:", accuracy_score(y_test, pred1))
    print(classification_report(y_test, pred1))
    print(confusion_matrix(y_test, pred1))

    pickle.dump(
        log_pipeline,
        open(os.path.join(MODEL_DIR, "logistic_model.pkl"), "wb")
    )

    # -------------------------
    # Naive Bayes
    # -------------------------

    nb_transformers = []

    for col in text_columns:
        nb_transformers.append(
            (f"tfidf_{col}", TfidfVectorizer(max_features=5000), col)
        )

    if numeric_columns:
        nb_transformers.append(
            ("num", MinMaxScaler(), numeric_columns)
        )

    if categorical_columns:
        nb_transformers.append(
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_columns)
        )

    nb_preprocessor = ColumnTransformer(nb_transformers)

    nb_pipeline = Pipeline([
        ("preprocessor", nb_preprocessor),
        ("classifier", MultinomialNB())
    ])

    nb_pipeline.fit(X_train, y_train)
    pred2 = nb_pipeline.predict(X_test)

    print("\n===== Naive Bayes =====")
    print("Accuracy:", accuracy_score(y_test, pred2))
    print(classification_report(y_test, pred2))
    print(confusion_matrix(y_test, pred2))

    pickle.dump(
        nb_pipeline,
        open(os.path.join(MODEL_DIR, "naive_model.pkl"), "wb")
    )

    # -------------------------
    # Random Forest
    # -------------------------

    rf_pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", RandomForestClassifier(
        n_estimators=200,
        random_state=42,
        class_weight="balanced"
    ))
])

    rf_pipeline.fit(X_train, y_train)
    pred3 = rf_pipeline.predict(X_test)

    print("\n===== Random Forest =====")
    print("Accuracy:", accuracy_score(y_test, pred3))
    print(classification_report(y_test, pred3))
    print(confusion_matrix(y_test, pred3))

    pickle.dump(
        rf_pipeline,
        open(os.path.join(MODEL_DIR, "rf_model.pkl"), "wb")
    )

    print("\nAll models saved successfully")


if __name__ == "__main__":
    train_model()