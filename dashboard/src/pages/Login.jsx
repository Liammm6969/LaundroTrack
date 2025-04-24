import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function navigateToSignup() {
    navigate("/signup");
  }

  async function handleLogin(event) {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:1337/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: formData.username, // Match backend field name!
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);
        // Optionally store user in localStorage or context
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/home");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      alert("An error occurred during login");
      console.error("Login error:", error);
    }
  }

  return (
    <div className="login-container">
      {/* Left side with illustration */}
      <div className="loginBg">
        <div className="image-content">
          <div className="pic">
            <img src="./src/pictures/LogIn.png" alt="Laundry illustration" />
          </div>
          <div className="feature-highlight">
            <span className="star-icon">★</span> FEATURE HIGHLIGHT
            <p className="feature-text">
              Monitor, Manage, and Master Your Laundry Operations right in your
              LaundroTrack account!
            </p>
          </div>
        </div>
      </div>

      {/* Right side with login form */}
      <div className="login-side">
        <div className="login-content">
          <h1 className="app-name">LaundroTrack</h1>

          <div className="tagline">
            <h2>Laundry Made Simple.</h2>
            <h2>
              Tracking Made <br /> Smarter.
            </h2>
          </div>

          <p className="welcome-message">
            Welcome back! Please use your email or another service to sign in.
          </p>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <TextField
                type="text"
                variant="standard"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <TextField
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                variant="standard"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-input"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <button className="login-button" onClick={handleLogin}>
              Login
            </button>
            <div className="form-footer">
              <div className="signup-link">
                <span>New to LaundroTrack?</span>
                <a href="#" onClick={navigateToSignup}>
                  {" "}
                  <u>Sign Up</u>
                </a>
              </div>
              <div className="forgot-password">
                <a href="#">
                  <u>Forgot Password?</u>
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
