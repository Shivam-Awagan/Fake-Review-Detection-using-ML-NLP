import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Paper,
  TextField,
  Typography,
  Box,
  Link
} from "@mui/material";

function Signin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        { name, email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.status === 200 || res.status === 201) {
        navigate("/login", { replace: true });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed. Please try again.");
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
      borderColor: "#00c6ff",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#00c6ff",
      boxShadow: "0 0 0 1px rgba(0,198,255,0.4)",
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
        <Typography variant="h5" fontWeight={700} textAlign="center" mb={3}>
          Sign Up
        </Typography>

        <form onSubmit={handleSignin}>
          <Typography fontSize="0.8rem" mb={0.4}>
            Name *
          </Typography>
          <TextField
            fullWidth
            required
            placeholder="Enter your name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputProps={{ sx: inputStyle }}
            sx={{ mb: 2.5 }}
          />

          <Typography fontSize="0.8rem" mb={0.4}>
            Email *
          </Typography>
          <TextField
            fullWidth
            required
            type="email"
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
            placeholder="Create a password"
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
              py: 1.3,
              fontWeight: 600,
              background: "linear-gradient(90deg,#00c6ff,#0072ff)",
              ":hover": {
                background: "linear-gradient(90deg,#1dd3ff,#0080ff)",
              },
            }}
            variant="contained"
          >
            SIGN UP
          </Button>
        </form>

        <Typography textAlign="center" mt={3} fontSize="0.9rem">
          Already have an account?{" "}
          <Link component={RouterLink} to="/login" sx={{ color: "#9ad0ff" }}>
            Login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Signin;
