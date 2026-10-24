import React from "react";
import { useNavigate } from "react-router-dom";

const QuickLinks = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        backgroundColor: "#0a0a0a",
        border: "1px solid #1f1f1f",
        borderRadius: "12px",
        padding: "24px",
      }}
    >
      <h3 style={{ margin: "0 0 16px 0", color: "#fff", fontSize: "15px" }}>
        Quick Links
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <button
          onClick={() => navigate("/projects")}
          style={{
            textAlign: "left",
            background: "transparent",
            border: "1px solid #1f1f1f",
            color: "#ccc",
            padding: "12px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          View All Projects →
        </button>
        <button
          onClick={() => navigate("/teams")}
          style={{
            textAlign: "left",
            background: "transparent",
            border: "1px solid #1f1f1f",
            color: "#ccc",
            padding: "12px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          View Field Teams →
        </button>
        <button
          onClick={() => navigate("/submit-report")}
          style={{
            textAlign: "left",
            background: "transparent",
            border: "1px solid #3b82f6",
            color: "#3b82f6",
            padding: "12px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Report an Issue →
        </button>
      </div>
    </div>
  );
};

export default QuickLinks;
