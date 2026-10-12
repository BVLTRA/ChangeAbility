import React from "react";
import "./Header.css";

const Header = () => (
  <header className="viewport-header">
    <h1 className="current-page-title">Dashboard</h1>
    <button className="header-action-btn">
      {/* SVG Icon */} Report Issue
    </button>
  </header>
);

export default Header;