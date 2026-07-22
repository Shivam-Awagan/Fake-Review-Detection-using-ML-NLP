import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Admin = () => {
  const navigate = useNavigate();

  const [review, setReview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [csvFile, setCsvFile] = useState(null);
  const [trainMsg, setTrainMsg] = useState("");
  const [training, setTraining] = useState(false);

  const analyze = async () => {
    if (!review.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/review/analyze-text",
        { text: review }
      );
      setResult(res.data);
    } catch {
      alert("Backend not responding");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file || !file.name.endsWith(".csv")) {
      setCsvFile(null);
      setTrainMsg("❌ Invalid file input, please upload valid file");
      return;
    }

    setCsvFile(file);
    setTrainMsg("");
  };

  const trainModel = async () => {
    if (!csvFile) {
      setTrainMsg("❌ Invalid file input, please upload valid file");
      return;
    }

    setTraining(true);
    setTrainMsg("⏳ Model training in progress...");

    const formData = new FormData();
    formData.append("file", csvFile);

    try {
      await axios.post(
        "http://localhost:5000/api/review/train-model",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setTrainMsg("✅ Model training is complete");
    } catch {
      setTrainMsg("❌ Model training failed");
    } finally {
      setTraining(false);
    }
  };

  return (
    <div className="page">
      <div className="hero">
        <h1>Fake Review Detector</h1>
      </div>

      <div className="center-wrapper">
        <div className="card">

        


   

          {result && (
            <div className="result">
              <h4>Likely {result.prediction} Review</h4>
              <p>Confidence: {result.confidence}%</p>

              <div className="progress">
                <div
                  className="progress-fill"
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
            </div>
          )}

          <hr />

          <h3>Train Model ( Using CSV)</h3>

          <label className="file-btn">
            Choose CSV File
            <input type="file" accept=".csv" onChange={handleFileChange} hidden />
          </label>

          <button
            onClick={trainModel}
            disabled={training}
            className="btn secondary"
          >
            {training ? "Training..." : "Train Model"}
          </button>

          {trainMsg && <p className="train-msg">{trainMsg}</p>}

          <button onClick={() => navigate("/")} className="back-btn-fixed">
            ← Back
          </button>

        </div>
      </div>

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
          margin-bottom: 24px;
        }

        .hero h1 {
          font-size: 36px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.7);
        }

        .center-wrapper {
          display: flex;
          justify-content: center;
        }

        .card {
          position: relative;
          width: 620px;
          background: rgba(0,0,0,0.45);
          backdrop-filter: blur(10px);
          padding: 26px;
          padding-bottom: 30px;
          border-radius: 18px;
          box-shadow: 0 18px 45px rgba(0,0,0,0.55);
        }

        .result {
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(8px);
          padding: 14px;
          border-radius: 14px;
          margin-top: 14px;
        }

        .back-btn-fixed {
          position: absolute;
          bottom: 16px;
          left: 16px;
          padding: 6px 12px;
          font-size: 12px;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          background: linear-gradient(90deg, #64748b, #475569);
          color: white;
          transition: all 0.25s ease;
        }

        .back-btn-fixed:hover {
          transform: scale(1.05);
          box-shadow: 0 0 10px rgba(224,229,235,0.9);
        }

        .textarea-wrapper {
          display: flex;
          justify-content: center;
        }

        textarea {
          width: 160%;
          max-width: 900px;
          height: 100px;
          border-radius: 14px;
          padding: 16px;
          border: 1px solid rgba(255,255,255,0.25);
          margin: 14px 0;
          font-size: 14px;
          resize: none;
          background: rgba(255,255,255,0.08);
          color: white;
          outline: none;
          transition: all 0.25s ease;
        }

        textarea::placeholder {
          color: rgba(255,255,255,0.6);
        }

        textarea:focus {
          border-color: #8e44ff;
          box-shadow: 0 0 0 2px rgba(142,68,255,0.35);
          background: rgba(255,255,255,0.12);
        }

        .btn,
        .file-btn {
          width: 60%;
          margin: 10px auto 0;
          padding: 8px;
          border-radius: 20px;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
          text-align: center;
          display: block;
          font-size: 14px;
        }

        .btn:hover,
        .file-btn:hover {
          transform: scale(1.04);
          box-shadow: 0 0 14px rgba(138,43,226,0.8);
        }

        .primary {
          background: linear-gradient(90deg, #8e2de2, #4a00e0);
          color: white;
        }

        .secondary {
          background: linear-gradient(90deg, #2fff2f, #2f872fff);
        }

        .file-btn {
          background: linear-gradient(90deg, #00c6ff, #0072ff);
        }

        .progress {
          height: 6px;
          background: rgba(255,255,255,0.25);
          border-radius: 10px;
          margin-top: 6px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #ff512f, #dd2476);
          border-radius: 10px;
        }

        .train-msg {
          margin-top: 10px;
          font-weight: 600;
          text-align: center;
          font-size: 13px;
        }

        hr {
          margin: 22px 0;
          border: 0.5px solid rgba(255,255,255,0.25);
        }

        h3, h4, p, span {
          text-shadow: 0 1px 2px rgba(0,0,0,0.6);
        }
      `}</style>
    </div>
  );
};

export default Admin;