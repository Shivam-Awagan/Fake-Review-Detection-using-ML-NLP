import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./Components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signin from "./pages/SigninUp";
import TrainModel from "./pages/TrainModel";
import UrlAnalysis from "./pages/UrlAnalysis";
import SingleReview from "./pages/SingleReview";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const [hasStarted, setHasStarted] = useState(
    localStorage.getItem("hasStarted") === "true"
  );

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem("hasStarted", hasStarted);
  }, [hasStarted]);


  return (
    <Router>

      {/* NAVBAR */}
      <Navbar
        isLoggedIn={isLoggedIn}
        hasStarted={hasStarted}
        setIsLoggedIn={setIsLoggedIn}
        setHasStarted={setHasStarted}
      />


      {/* PAGE AREA */}
      <div
        className="app-content"
        style={{
          height: "calc(100vh - 64px)",
          overflowY: "auto"
        }}
      >

        <Routes>

          {/* DEFAULT */}
          <Route
            path="/"
            element={<Navigate to={isLoggedIn ? "/home" : "/login"} replace />}
          />


          {/* LOGIN */}
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />

          <Route
            path="/signin"
            element={<Signin />}
          />


          {/* HOME */}
          <Route
            path="/home"
            element={
              isLoggedIn
                ? <Home setHasStarted={setHasStarted} />
                : <Navigate to="/login" replace />
            }
          />


          {/* TRAIN MODEL  ✅ FIXED */}
          <Route
            path="/train-model"
            element={
              isLoggedIn
                ? <TrainModel />
                : <Navigate to="/login" replace />
            }
          />


          {/* URL ANALYSIS  ✅ FIXED */}
          <Route
            path="/url-analysis"
            element={
              isLoggedIn
                ? <UrlAnalysis />
                : <Navigate to="/login" replace />
            }
          />


          {/* SINGLE REVIEW  ✅ FIXED */}
          <Route
            path="/single-analysis"
            element={
              isLoggedIn
                ? <SingleReview />
                : <Navigate to="/login" replace />
            }
          />


          {/* UNKNOWN */}
          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />

        </Routes>

      </div>

    </Router>
  );
}

export default App;