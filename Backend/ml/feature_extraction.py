from sklearn.feature_extraction.text import TfidfVectorizer

def create_vectorizer():
    return TfidfVectorizer(
        max_features=30000,          # Increased vocabulary size
        ngram_range=(1, 2),          # Unigram + Bigram (important for fake phrases)
        stop_words="english",
        min_df=3,                    # Ignore very rare words
        max_df=0.85,                 # Ignore overly common words
        sublinear_tf=True,           # Better term frequency scaling
        strip_accents="unicode",     # Normalize accented characters
        token_pattern=r"\b[a-zA-Z]{2,}\b"  # Ignore single character tokens
    )
