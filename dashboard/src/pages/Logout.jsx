import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";

function Logout(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
  
    const handleLogin = () => {
      if (username === "admin" && password === "admin") {
        navigate("/home");
      } else {
        setError("Invalid username or password");
      }
    };
  
    return (
      <div className="home">
        <div className="content">
          <h1>Welcome to Wash Wise</h1>
          <p>Smart laundry scheduling at your fingertips.</p>
  
          <TextField 
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <TextField 
            placeholder="Password" 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          {error && <p style={{ color: "red" }}>{error}</p>}
          
          <Button variant="contained" onClick={handleLogin}>Login</Button>
        </div>
      </div>
    )
}

export default Logout;