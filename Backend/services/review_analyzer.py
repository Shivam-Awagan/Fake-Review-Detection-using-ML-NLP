from ml.preprocess import clean_text
from ml.model_loader import load_model
from services.confidence_engine import calculate_confidence
from services.url_review_extractor import extract_reviews_from_url

model, vectorizer = load_model()

def analyze_review_text(text):
    cleaned = clean_text(text)
    vector = vectorizer.transform([cleaned])
    prediction = model.predict(vector)[0]
    confidence = calculate_confidence(model, vector)

    return {
        "prediction": "Genuine" if prediction == 1 else "Fake",
        "confidence": confidence
    }

def analyze_review_url(url):
    extracted_text = extract_reviews_from_url(url)

    if not extracted_text:
        return {"error": "No review text found from URL"}

    return analyze_review_text(extracted_text)
