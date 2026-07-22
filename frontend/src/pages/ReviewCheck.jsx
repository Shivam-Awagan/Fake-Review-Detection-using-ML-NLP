import { useState } from "react";
import API from "../Services/api";

function ReviewCheck() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const checkReview = async () => {
    try {
      setError("");
      const res = await API.post("/review/analyze-text", {
        text: text
      });
      setResult(res.data);
    } catch (err) {
      setError("Failed to analyze review");
    }
  };

  return (
    <div className="container">
      <h2>Live Review Text Analysis</h2>

      <textarea
        rows="5"
        placeholder="Enter review text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <br />
      <button onClick={checkReview}>Analyze</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div>
          <h3>Prediction: {result.prediction}</h3>
          <p>Confidence: {result.confidence}%</p>
        </div>
      )}
    </div>
  );
}

export default ReviewCheck;
