def calculate_confidence(model, vector):
    """
    Returns confidence score (0–100)
    """
    if hasattr(model, "predict_proba"):
        prob = model.predict_proba(vector)[0]
        return round(max(prob) * 100, 2)
    else:
        return 100.0
