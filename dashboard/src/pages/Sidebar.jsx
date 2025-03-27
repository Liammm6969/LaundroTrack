import React from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import QrCodeIcon from "@mui/icons-material/QrCode";
import BuildIcon from "@mui/icons-material/Build";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>LaundroTrack</h2>
      <div className="menu">
        <HomeIcon className="icon" />
        <Link to="/home" className="link">
          <p>HOME</p>
        </Link>
      </div>

      <div className="menu">
        <QrCodeIcon className="icon" />
        <Link to="/qrcode" className="link">
          <p>QR CODE</p>
        </Link>
      </div>

      <div className="menu">
        <BuildIcon className="icon" />
        <Link to="/error" className="link">
          <p>SERVICES</p>
        </Link>
      </div>

      <div className="menu">
        <AssessmentIcon className="icon" />
        <Link to="/dashboard" className="link">
          <p>REPORTS</p>
        </Link>
      </div>

      <div className="menu">
        <ShoppingCartIcon className="icon" />
        <Link to="/error" className="link">
          <p>ORDER STATUS</p>
        </Link>
      </div>

      <div className="menu">
        <AccountCircleIcon className="icon" />
        <Link to="/user" className="link">
          <p>USER</p>
        </Link>
      </div>

      <div className="menu">
        <SettingsIcon className="icon" />
        <Link to="/settings" className="link">
          <p>SETTINGS</p>
        </Link>
      </div>

      <div className="menu">
        <LogoutIcon className="icon" />
        <Link to="/" className="link">
          <p>LOGOUT</p>
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;