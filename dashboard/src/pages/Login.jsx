import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import { Button, IconButton, TextField, InputAdornment } from "@mui/material";
import axios from "axios";
import "./Login.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function Login() {
  const [formData, setFormData] = useState({ userName: "", password: "" });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
  function navigateToSignup(){
    navigate('/signup')
  }
  async function handleLogin(event) {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:1337/login",
        formData
      );
      navigate("/home");
    } catch (error) {
      alert("Invalid username or password");
      console.error("Login error:", error);
    }
  }

  return (
    <div className="loginbody">
      <div className="bubbles">
      <img src="src\pictures\bubblesPng.png" alt="" />
      </div>
      <div>
        
        <img src="" alt="" />
        <h1 className="title">LaundroTrack</h1>
        
        <p className="desc">Our system enhances user experience in managing laundry <br />LaundroTrack aims to innovate laundry management system</p>
      </div>
      <div className="login">
        <div className="login-box">
          <h2 className="sign-in">Sign in</h2>
          <form onSubmit={handleLogin}>
            <TextField
              type="text"
              name="userName"
              placeholder="Username"
              value={formData.userName}
              onChange={handleChange}
              required
              fullWidth
              className="sign-in-field"
            />

            <div className="password-container">
              <TextField
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                fullWidth
                className="sign-in-field"
              />
              <IconButton
                className="eyeIcon"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
              
            </div>
            <a href="" className="forgot"><u>Forgot your password?</u></a>
            <Button variant="contained" type="submit" className="loginButton" startIcon={<LoginIcon />}>
              Login
            </Button>
            <p className="sign-up" >Don't have an account? <a href="" onClick={navigateToSignup}>Sign up</a> </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
