import { useState } from "react";
import API from "../Services/api";

function SingleReview() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ CHANGE 1 (only this line changed)
  const [model, setModel] = useState("logistic");

  const analyzeReview = async () => {
    if (!text.trim()) return;

    try {
      setError("");
      setResult(null);
      setLoading(true);

      // ✅ CHANGE 2 (only this line changed)
      const res = await API.post("/api/review/analyze-text", {
        text,
        model: model || "logistic",
      });

      setResult(res.data);

    } catch (err) {
      if (!err.response) {
        setError("⚠️ Backend is not running. Please start the server.");
      } else {
        setError("❌ Failed to analyze review");
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
          <h3>Enter Single Review</h3>

          <textarea
            className="url-input"
            placeholder="Please enter a single review here"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <p className="hint">
            Enter a single review. Our system will analyze its authenticity using ML & NLP.
          </p>

          {/* ✅ MODEL SELECT */}
          <div className="model-box">

            <label>Select Model</label>

            <select
              className="model-select"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >

              {/* optional change safe */}
              <option value="logistic">
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
                ? "No model selected. The system will use the highest accuracy model."
                : `Review will be analyzed using ${model} model.`}

            </p>

          </div>

          <button
            className={`btn primary ${loading ? "loading" : ""}`}
            onClick={analyzeReview}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze Review"}
          </button>

          {error && <p className="error">{error}</p>}
        </div>
      </div>

      {result && (
        <div className="results-wrapper">
          <div className="batch-card">
            <h3>Analysis Result</h3>

            <span className="risk">
              Prediction: {result.prediction}
            </span>

            <div className="stats">
              <div className="stat">
                Confidence<br />
                <b>{result.confidence}%</b>
              </div>
            </div>
          </div>

          <div className="reviews">
            <h4>Review Preview</h4>

            <div className={`review ${result.prediction === "Fake" ? "fake" : "genuine"}`}>
              <div className="review-head">
                <span>User</span>
                <span>{result.confidence}%</span>
              </div>

              <p>{text}</p>

              <span className={`tag ${result.prediction === "Fake" ? "fake" : "genuine"}`}>
                {result.prediction === "Fake" ? "Likely Fake" : "Likely Genuine"}
              </span>
            </div>
          </div>
        </div>
      )}

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
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.25);
          margin: 14px 0;
          font-size: 14px;
          background: rgba(255,255,255,0.08);
          color: white;
          outline: none;
          height: 100px;
          resize: none;
        }

        .hint {
          font-size: 13px;
          opacity: 0.85;
        }

        .btn {
          width: 220px;
          margin: 18px auto 0;
          padding: 10px;
          border-radius: 20px;
          border: none;
          cursor: pointer;
          display: block;
          font-size: 14px;
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

        /* ✅ NEW */

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

/* ================= RESULT UI ================= */

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

        /* ✅ Genuine = Green */
        .tag.genuine {
          background: #4ade80;
          color: #000;
        }

        /* ✅ Fake = Red */
        .tag.fake {
          background: #ff4d4f;
          color: white;
        }


      `}</style>
    </div>
  );
}

export default SingleReview;