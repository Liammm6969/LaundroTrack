import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import QrCodeIcon from "@mui/icons-material/QrCode";
import BuildIcon from "@mui/icons-material/Build";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

function Sidebar({ onToggle }) {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      if (!mobile) {
        setIsOpen(true);
      }
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Communicate sidebar state to parent component
  useEffect(() => {
    if (onToggle) {
      onToggle(isOpen);
    }
  }, [isOpen, onToggle]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleBackdropClick = (e) => {
    if (isMobile && isOpen) {
      setIsOpen(false);
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <>
      {/* Mobile toggle button */}
      {isMobile && (
        <div className="toggle-btn" onClick={toggleSidebar}>
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </div>
      )}

      {/* Backdrop for mobile */}
      {isMobile && isOpen && (
        <div className="sidebar-backdrop" onClick={handleBackdropClick}></div>
      )}

      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <h2>LaundroTrack</h2>
        
        <div className="menu-items">
          <div className={`menu ${isActive("/home")}`}>
            <HomeIcon className="icon" />
            <Link to="/home" className="link" onClick={() => isMobile && setIsOpen(false)}>
              <p>HOME</p>
            </Link>
          </div>

          <div className={`menu ${isActive("/qrcode")}`}>
            <QrCodeIcon className="icon" />
            <Link to="/qrcode" className="link" onClick={() => isMobile && setIsOpen(false)}>
              <p>QR CODE</p>
            </Link>
          </div>

          <div className={`menu ${isActive("/error")}`}>
            <BuildIcon className="icon" />
            <Link to="/error" className="link" onClick={() => isMobile && setIsOpen(false)}>
              <p>SERVICES</p>
            </Link>
          </div>

          <div className={`menu ${isActive("/dashboard")}`}>
            <AssessmentIcon className="icon" />
            <Link to="/dashboard" className="link" onClick={() => isMobile && setIsOpen(false)}>
              <p>REPORTS</p>
            </Link>
          </div>

          <div className={`menu ${isActive("/orderstatus")}`}>
            <ShoppingCartIcon className="icon" />
            <Link to="/orderstatus" className="link" onClick={() => isMobile && setIsOpen(false)}>
              <p>ORDER STATUS</p>
            </Link>
          </div>

          <div className={`menu ${isActive("/user")}`}>
            <AccountCircleIcon className="icon" />
            <Link to="/user" className="link" onClick={() => isMobile && setIsOpen(false)}>
              <p>USER</p>
            </Link>
          </div>

          <div className="menu">
            <SettingsIcon className="icon" />
            <Link to="/error" className="link" onClick={() => isMobile && setIsOpen(false)}>
              <p>SETTINGS</p>
            </Link>
          </div>

          <div className="menu">
            <LogoutIcon className="icon" />
            <Link to="/login" className="link" onClick={() => isMobile && setIsOpen(false)}>
              <p>LOGOUT</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;