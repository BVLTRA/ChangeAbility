import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/images/logo.png";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State to handle the dropdown toggle
  const [isPeopleMenuOpen, setIsPeopleMenuOpen] = useState(true);

  // Checks the current URL to highlight the active button
  const isActive = (path) => (location.pathname === path ? "active" : "");
  const isPeopleActive = location.pathname.includes("/people");

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src={logo} alt="Relay Logo" className="brand-logo" height="32" />
        <span className="brand-text">ChangeAbility</span>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-item ${isActive("/dashboard")}`}
          onClick={() => navigate("/dashboard")}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" rx="1"></rect>
            <rect x="14" y="3" width="7" height="7" rx="1"></rect>
            <rect x="14" y="14" width="7" height="7" rx="1"></rect>
            <rect x="3" y="14" width="7" height="7" rx="1"></rect>
          </svg>
          Dashboard
        </button>
        {/* --- DROPDOWN NAVIGATION --- */}
        <div className="nav-dropdown-group">
          <button
            className={`nav-item ${isPeopleActive ? "active" : ""}`}
            onClick={() => setIsPeopleMenuOpen(!isPeopleMenuOpen)}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span style={{ flex: 1, textAlign: "left" }}>People</span>
            <svg
              className={`chevron ${isPeopleMenuOpen ? "open" : ""}`}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          {isPeopleMenuOpen && (
            <div className="sub-nav">
              <button
                className={`sub-nav-item ${isActive("/people/volunteers")}`}
                onClick={() => navigate("/people/volunteers")}
              >
                Volunteers
              </button>
              <button
                className={`sub-nav-item ${isActive("/people/beneficiaries")}`}
                onClick={() => navigate("/people/beneficiaries")}
              >
                Beneficiaries
              </button>
            </div>
          )}
        </div>
        <button
          className={`nav-item ${isActive("/add-beneficiary")}`}
          onClick={() => navigate("/add-beneficiary")}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="8.5" cy="7" r="4"></circle>
            <line x1="20" y1="8" x2="20" y2="14"></line>
            <line x1="23" y1="11" x2="17" y2="11"></line>
          </svg>
          Add Beneficiary
        </button>
        <button
          className={`nav-item ${isActive("/reports")}`}
          onClick={() => navigate("/reports")}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 2v4"></path>
            <path d="M16 2v4"></path>
            <rect x="4" y="8" width="16" height="14" rx="2"></rect>
            <path d="M9 14h6"></path>
            <path d="M9 18h6"></path>
            <path d="M12 11v8"></path>
          </svg>
          All Reports
        </button>
        <button
          className={`nav-item ${isActive("/analytics")}`}
          onClick={() => navigate("/analytics")}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
          Analytics
        </button>
        <button
          className={`nav-item ${isActive("/calendar")}`}
          onClick={() => navigate("/calendar")}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          Calendar
        </button>
        <button
          className={`nav-item ${isActive("/reminders")}`}
          onClick={() => navigate("/reminders")}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          Reminders
        </button>
        <button
          className={`nav-item ${isActive("/settings")}`}
          onClick={() => navigate("/settings")}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          Settings
        </button>
      </nav>

      <div className="sidebar-user">
        <div className="user-avatar">O</div>
        <div className="user-info">
          <span className="user-name">Operator</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
