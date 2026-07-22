import { useState } from "react";
import API from "../Services/api";

function UrlAnalysis() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ ADDED
  const [model, setModel] = useState("");

  const analyzeUrl = async () => {
    if (!url.trim()) return;

    try {
      setError("");
      setResult(null);
      setLoading(true);

      // ✅ ADDED model
      const res = await API.post("/api/review/analyze-url", {
        url,
        model,
      });

      setResult(res.data);

    } catch (err) {
      if (!err.response) {
        setError("⚠️ Backend is not running. Please start the server.");
      } else {
        setError("❌ Failed to analyze URL");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="hero">
         <h1 className="title-shadow">Fake Review Detector</h1>
      </div>

      <div className="center-wrapper">
        <div className="card">
          <h3>Enter URL</h3>

          <input
            className="url-input"
            type="text"
            placeholder="Enter the review page URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <p className="hint">
            Enter a review page URL. Our system will analyze all available reviews.
          </p>


          {/* ✅ MODEL SELECT ADDED */}

          <div className="model-box">

            <label>Select Model</label>

            <select
              className="model-select"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >

              <option value="">
                Auto Select (Best Accuracy Model)
              </option>

              <option value="logistic">
                Logistic Regression
              </option>

              <option value="naive">
                Naive Bayes
              </option>

              <option value="rf">
                Random Forest
              </option>

            </select>

            <p className="model-info">

              {model === ""
                ? "No model selected. Highest accuracy model will be used."
                : `Reviews will be analyzed using ${model} model.`}

            </p>

          </div>


          <button
            className={`btn primary ${loading ? "loading" : ""}`}
            onClick={analyzeUrl}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze Reviews"}
          </button>

          {error && <p className="error">{error}</p>}

          {result?.message && (
            <p className="error" style={{ color: "#ffd166" }}>
              {result.message}
            </p>
          )}
        </div>
      </div>

      {result && (
        <div className="results-wrapper">
          <div className="batch-card">
            <div>
              <h3>Batch Analysis Complete</h3>
              <p>Analyzed {result.total_reviews} reviews</p>
            </div>

            <span className="risk">Risk Level: MEDIUM</span>

            <div className="stats">
              <div className="stat">
                Total<br /><b>{result.total_reviews}</b>
              </div>
              <div className="stat green">
                Genuine<br /><b>{result.genuine}</b>
              </div>
              <div className="stat red">
                Fake<br /><b>{result.fake}</b>
              </div>
              <div className="stat">
                Avg Confidence<br /><b>{result.avg_confidence}%</b>
              </div>
            </div>
          </div>

          <div className="reviews">
            <h4>Review Details</h4>

            {result.reviews && result.reviews.length === 0 && (
              <p style={{ opacity: 0.8 }}>
                ⚠️ No reviews could be fetched from this URL.
              </p>
            )}

            {result.reviews && result.reviews.map((r, i) => (
              <div key={i} className={`review ${r.label}`}>
                <div className="review-head">
                  <span>{r.user}</span>
                  <span>{r.confidence}%</span>
                </div>
                <p>{r.text}</p>
                <span className={`tag ${r.label}`}>
                  {r.label === "fake" ? "Likely Fake" : "Likely Genuine"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* ================= CSS ================= */}
      <style>{`
        .page {
          height: calc(100vh - 64px);
          overflow-y: auto;
          background: transparent;
          color: white;
          font-family: "Segoe UI", sans-serif;
          padding: 32px;
        }

        .hero {
          text-align: center;
          margin-bottom: 30px;
          margin-top: 20px;
        }

        .title-shadow {
  color: white;
  font-size: 38px;
  font-weight: 700;

  text-shadow:
    1px 1px 2px black,
    0px 3px 6px rgba(0,0,0,0.8);
}

        .center-wrapper {
          display: flex;
          justify-content: center;
        }

        .card {
          width: 720px;
          background: rgba(0,0,0,0.45);
          backdrop-filter: blur(20px);
          padding: 26px;
          border-radius: 18px;
          box-shadow: 0 18px 45px rgba(0,0,0,0.5);
        }

        .url-input {
          width: 100%;
          padding: 14px 16px;
          padding-bottom: 60px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.25);
          margin: 14px 0;
          font-size: 14px;
          background: rgba(255,255,255,0.08);
          color: white;
          outline: none;
          height: 100px;
        }

        .url-input::placeholder {
          color: rgba(255,255,255,0.6);
        }

        .hint {
          font-size: 13px;
          opacity: 0.85;
        }

        .btn {
          width: 220px;
          margin: 14px auto 0;
          padding: 10px;
          border-radius: 20px;
          border: none;
          cursor: pointer;
          display: block;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .btn:hover {
          transform: scale(1.07);
          box-shadow: 0 0 18px rgba(138,43,226,0.9);
        }

        .primary {
          background: linear-gradient(90deg,#8e2de2,#4a00e0);
          color: white;
        }

        .error {
          color: #ffb4b4;
          text-align: center;
          margin-top: 12px;
          font-weight: 600;
        }

        .results-wrapper {
          max-width: 900px;
          margin: 30px auto;
          background: rgba(0,0,0,0.45);
          backdrop-filter: blur(10px);
          border-radius: 18px;
          padding: 24px;
        }

        .batch-card,
        .reviews .review,
        .stat {
          background: rgba(0,0,0,0.55);
          border-radius: 14px;
          padding: 16px;
          margin-bottom: 16px;
        }

        .risk {
          color: #ffd166;
          font-weight: bold;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 14px;
        }

        .green { color:#4ade80 }
        .red { color:#ff6b6b }

        .review-head {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
        }

        .tag {
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 10px;
          display: inline-block;
          margin-top: 6px;
        }

        .tag.fake { background:#ff6b6b }
        .tag.genuine { background:#4ade80 }

        .model-box {
          margin-top: 10px;
        }

        .model-select {
           width: 100%;
           padding: 8px;
           border-radius: 8px;
           margin-top: 6px;
           background: rgba(33, 107, 186, 0.8);
           color: white;
         border: 1px solid rgba(101, 93, 93, 0.3);
}


/* ✅ dropdown options color fix */

.model-select option {
  background: #1e1e1e;
  color: white;
}
      `}</style>
    </div>
  );
}

export default UrlAnalysis;
