import re
import string

# ======================================================
# 🔹 CLEAN TEXT FUNCTION (Improved for Fake Detection)
# ======================================================
def clean_text(text):
    text = str(text).lower()

    # Remove URLs
    text = re.sub(r"http\S+|www\S+", "", text)

    # Remove emails
    text = re.sub(r"\S+@\S+", "", text)

    # Remove numbers
    text = re.sub(r"\d+", "", text)

    # Normalize repeated characters (e.g., loooove → loove)
    text = re.sub(r"(.)\1{2,}", r"\1\1", text)

    # Remove punctuation
    text = text.translate(str.maketrans("", "", string.punctuation))

    # Remove extra spaces
    text = re.sub(r"\s+", " ", text).strip()

    return text


# ======================================================
# 🔥 EXTRA FEATURES FOR FAKE DETECTION (Hybrid Model)
# ======================================================
def extra_features(text):
    text = str(text)

    words = text.split()

    # Repeated word ratio
    repeated_ratio = (len(words) - len(set(words))) / (len(words) + 1)

    # Exclamation marks count
    exclamations = text.count("!")

    # Capital letter ratio
    capital_ratio = sum(1 for c in text if c.isupper()) / (len(text) + 1)

    # Spam keyword score
    spam_keywords = [
        "buy now",
        "limited offer",
        "100%",
        "guarantee",
        "best ever",
        "must buy",
        "hurry",
        "cheap price",
        "instant results"
    ]

    spam_score = sum(1 for word in spam_keywords if word in text.lower())

    return [repeated_ratio, exclamations, capital_ratio, spam_score]
