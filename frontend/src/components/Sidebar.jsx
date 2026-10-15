import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import "./Sidebar.css";

const Sidebar = ({ user }) => {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src={logo} alt="Relay Logo" className="brand-logo" height="32" />
        <span className="brand-text">ChangeAbility</span>
      </div>

      <nav className="sidebar-nav">
        <button className="nav-item active" onClick={() => navigate('/dashboard')}>
          {/* SVG Icon */} Dashboard
        </button>
        <button className="nav-item" onClick={() => navigate('/report-issue')}>
          {/* SVG Icon */} Report Issue
        </button>
        <button className="nav-item" onClick={() => navigate('/all-reports')}>
          {/* SVG Icon */} All Reports
        </button>
        <button className="nav-item" onClick={() => navigate('/analytics')}>
          {/* SVG Icon */} Analytics
        </button>
        <button className="nav-item">
          {/* SVG Icon */} Settings
        </button>
      </nav>

      <div className="sidebar-user">
        <div className="user-avatar">{user ? user.name.charAt(0) : "U"}</div>
        <div className="user-info">
          <span className="user-name">
            {user ? `${user.name} ${user.surname}` : "User"}
          </span>
        </div>
        <button className="logout-icon">{/* SVG Icon */}</button>
      </div>
    </aside>
  );
};

export default Sidebar;