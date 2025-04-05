import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, IconButton, TextField, InputAdornment } from '@mui/material';
import axios from 'axios';
import './SignUp.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

function SignUp() {
  const [formData, setFormData] = useState({
    userId: '',
    firstName: '',
    lastName: '',
    middleName: '',
    userName: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSignUp(event) {
    event.preventDefault();
    
    // Password confirmation validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    
    try {
      // Check if username already exists
      const { data: users } = await axios.get("http://localhost:1337/fetchusers");
      const exists = users.some((user) => user.userName === formData.userName);

      if (exists) {
        alert("Username already exists!");
        return;
      }
      
      // Remove confirmPassword before sending to backend
      const dataToSend = { ...formData };
      delete dataToSend.confirmPassword;
      
      // Add the user
      await axios.post("http://localhost:1337/addusers", dataToSend);
      alert("Account created successfully!");
      navigate('/login');
    } catch (error) {
      console.error("Registration error:", error);
      alert("Error creating account. Please try again.");
    }
  }

  function navigateToLogin() {
    navigate('/login');
  }

  return (
    <div className='signupbody'>
      <div className='signup'>
        <div className='signup-box'>
          <h3 className='signUpName'>LaundroTrack</h3>
          <h2 className='createAccount'>Create Account</h2>  
          <form onSubmit={handleSignUp} className='form'>
            <div className="name-fields">
              <TextField
                type="text"
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
                fullWidth
                className="signupField"
              />
              
              <TextField
                type="text"
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
                fullWidth
                className="signupField"
              />
            </div>
            
            <TextField
              type="text"
              name="middleName"
              label="Middle Name"
              value={formData.middleName}
              onChange={handleChange}
              fullWidth
              className="signupField"
            />
            
            <TextField
              type="text"
              name="userName"
              label="Username"
              value={formData.userName}
              onChange={handleChange}
              required
              fullWidth
              className="signupField"
            />
            
            <div className="password-container">
              <TextField
                type={showPassword ? "text" : "password"}
                name="password"
                label="Password"
                value={formData.password}
                onChange={handleChange}
                required
                fullWidth
                className="signupField"
              />
              <IconButton className='eyeIcon' onClick={() => setShowPassword(prev => !prev)}>
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </div>
            
            <div className="password-container">
              <TextField
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                fullWidth
                className="signupField"
              />
              <IconButton className='eyeIcon' onClick={() => setShowConfirmPassword(prev => !prev)}>
                {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </div>

            <Button className="create"variant="contained" type="submit" startIcon={<PersonAddIcon />} fullWidth>
              Create Account
            </Button>
          </form>
          
          <div className="login-link">
            Already have an account? <a href='' onClick={navigateToLogin}>Sign in</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;