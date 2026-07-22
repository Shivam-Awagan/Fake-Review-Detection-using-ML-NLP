from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

import time
import re


def extract_reviews_from_url(url):

    reviews = []
    seen = set()

    if not url.startswith("http"):
        print("Invalid URL")
        return reviews

    chrome_options = Options()

    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")

    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=chrome_options
    )

    try:

        print("Opening:", url)

        # =============================
        # AMAZON → REVIEW PAGE FIX
        # =============================

        if "amazon." in url and "/product-reviews/" not in url:

            m = re.search(r"/dp/([A-Z0-9]+)", url)

            if m:
                asin = m.group(1)
                url = f"https://www.amazon.in/product-reviews/{asin}?pageNumber=1"

        driver.get(url)

        time.sleep(4)

        # =============================
        # SMART SCROLL
        # =============================

        last_height = driver.execute_script(
            "return document.body.scrollHeight"
        )

        for _ in range(10):

            driver.execute_script(
                "window.scrollTo(0, document.body.scrollHeight);"
            )

            time.sleep(1.5)

            new_height = driver.execute_script(
                "return document.body.scrollHeight"
            )

            if new_height == last_height:
                break

            last_height = new_height

        elements = []

        # =============================
        # AMAZON
        # =============================

        if "amazon." in url:

            elements = driver.find_elements(
                By.XPATH,
                "//div[@data-hook='review']"
            )

        # =============================
        # FLIPKART
        # =============================

        elif "flipkart.com" in url:

            elements = driver.find_elements(
                By.XPATH,
                "//div[contains(@class,'review') or "
                "contains(@class,'ZmyHeo') or "
                "contains(@class,'t-ZTKy')]"
            )

        # =============================
        # GENERIC WEBSITES
        # =============================

        else:

            elements = driver.find_elements(
                By.XPATH,
                "//div[contains(@class,'review') or "
                "contains(@class,'comment') or "
                "contains(@class,'feedback') or "
                "contains(@class,'content') or "
                "contains(@class,'text')]"
            )

            if len(elements) == 0:

                elements = driver.find_elements(
                    By.XPATH,
                    "//p"
                )

        # =============================
        # FILTER ENGINE (important)
        # =============================

        for el in elements:

            text = el.text.strip()

            if len(text) < 25:
                continue

            if text in seen:
                continue

            t = text.lower()

            # remove non-review blocks
            if "report" in t:
                continue

            if "helpful" in t:
                continue

            if "rating" in t:
                continue

            if "read more" in t:
                continue

            if "verified purchase" in t:
                pass  # allow

            seen.add(text)
            reviews.append(text)

        print("Total reviews:", len(reviews))

    except Exception as e:

        print("Scraping error:", e)

    finally:

        driver.quit()

    return reviews