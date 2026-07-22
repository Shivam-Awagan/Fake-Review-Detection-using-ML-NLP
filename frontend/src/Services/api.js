import axios from "axios";

// 🔥 Base URL WITHOUT api prefix (prevents duplication)
const API = axios.create({
  baseURL: "http://localhost:5000"
});


// ===============================
// 🔹 Analyze Text Review
// ===============================
export const analyzeText = (text, model = "logistic") => {
  return API.post("/api/review/analyze-text", {
    text,
    model
  });
};


// ===============================
// 🔹 Analyze URL Reviews
// ===============================
export const analyzeURL = (url, model = "logistic") => {
  return API.post("/api/review/analyze-url", {
    url,
    model
  });
};


// ===============================
// 🔹 Train Model From CSV (File Upload)
// ===============================
export const trainModel = (file) => {

  const formData = new FormData();
  formData.append("file", file);

  return API.post(
    "/api/review/train-model",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
};


export default API;