import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Paper,
  TextField,
  Typography,
  Link,
  Box
} from "@mui/material";

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: email.toLowerCase().trim(),   // ✅ normalize email
          password: password.trim()
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.status === 200) {

        // ✅ Clear any previous session
        localStorage.clear();

        // ✅ Save current logged-in user (NO password stored)
        const userData = res.data.user;
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("isLoggedIn", "true");

        setIsLoggedIn(true);

        navigate("/home");
      } else {
        alert("Login failed");
      }

    } catch (err) {
      alert(err.response?.data?.message || "Invalid email or password");
    }
  };

  const inputStyle = {
    height: 44,
    fontSize: "0.95rem",
    background: "rgba(255,255,255,0.10)",
    borderRadius: 1.5,
    color: "white",
    "& fieldset": {
      borderColor: "rgba(255,255,255,0.25)",
    },
    "&:hover fieldset": {
      borderColor: "#7b2ff7",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#7b2ff7",
      boxShadow: "0 0 0 1px rgba(123,47,247,0.4)",
    },
    "& input": {
      color: "white",
    },
    "& input::placeholder": {
      color: "rgba(255,255,255,0.6)",
    },
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px rgba(20,30,40,0.9) inset",
      WebkitTextFillColor: "white",
    },
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "transparent",
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          width: { xs: "90%", sm: "420px" },
          background: "rgba(20, 30, 40, 0.78)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 20px 45px rgba(0,0,0,0.45)",
          color: "white",
        }}
      >
        <Typography variant="h5" textAlign="center" fontWeight={700} mb={3}>
          Login
        </Typography>

        <form onSubmit={handleLogin}>
          <Typography fontSize="0.8rem" mb={0.4}>
            Email *
          </Typography>
          <TextField
            fullWidth
            required
            placeholder="Enter your email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{ sx: inputStyle }}
            sx={{ mb: 2.5 }}
          />

          <Typography fontSize="0.8rem" mb={0.4}>
            Password *
          </Typography>
          <TextField
            fullWidth
            required
            type="password"
            placeholder="Enter your password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{ sx: inputStyle }}
            sx={{ mb: 3.5 }}
          />

          <Button
            type="submit"
            fullWidth
            sx={{
              py: 1.2,
              fontWeight: 600,
              background: "linear-gradient(90deg,#00c6ff,#0072ff)",
              ":hover": {
                background: "linear-gradient(90deg,#1dd3ff,#0080ff)",
              },
            }}
            variant="contained"
          >
            LOGIN
          </Button>
        </form>

        <Typography textAlign="center" mt={3} fontSize="0.9rem">
          Don&apos;t have an account?{" "}
          <Link component={RouterLink} to="/signin" sx={{ color: "#9ad0ff" }}>
            Sign up
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;