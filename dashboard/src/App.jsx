import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QRCodeGenerator from "./pages/qrcode";
import ChatBot from "./pages/ChatBot";
import Home from "./pages/Home";
import Login from "./pages/Login";
import LoadingScreen from "./pages/LoadingScreen";
import { useState, useEffect } from "react";
import OrderStatus from "./pages/OrderStatus";
import Dashboard from "./pages/Dashboard"
import User from "./pages/User"

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000);
  }, []);

  return (
    <Router>
      {loading ? (
        <LoadingScreen />
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/qrcode" element={<QRCodeGenerator />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orderstatus" element={<OrderStatus />} />
          <Route path="/user" element={<User />} />
          <Route path="/OrderStatus" element={<OrderStatus />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
