import requests
from bs4 import BeautifulSoup

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}

def extract_reviews_from_url(url, limit=10):
    reviews = []

    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        # 🔹 Collect multiple text blocks (demo-friendly)
        review_tags = soup.find_all("p")

        for tag in review_tags:
            text = tag.get_text(strip=True)

            # Filter very small / irrelevant text
            if len(text) > 30:
                reviews.append(text)

            if len(reviews) >= limit:
                break

    except Exception as e:
        print("❌ URL review extraction error:", e)

    return reviews
