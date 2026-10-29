import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const MetricsGrid = () => {
  const { token } = useContext(AuthContext);
  const [metrics, setMetrics] = useState({
    beneficiaries: 0,
    activeProjects: 0,
    teams: 0,
    pendingTasks: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/metrics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) setMetrics(await response.json());
      } catch (error) {
        console.error("Metrics load failed", error);
      }
    };
    if (token) fetchMetrics();
  }, [token]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#0a0a0a",
          border: "1px solid #1f1f1f",
          borderRadius: "12px",
          padding: "24px",
        }}
      >
        <h3
          style={{
            margin: "0 0 8px 0",
            color: "#888",
            fontSize: "13px",
            fontWeight: "500",
          }}
        >
          Active Beneficiaries
        </h3>
        <div style={{ fontSize: "32px", color: "#fff", fontWeight: "600" }}>
          {metrics.beneficiaries}
        </div>
      </div>
      <div
        style={{
          backgroundColor: "#0a0a0a",
          border: "1px solid #1f1f1f",
          borderRadius: "12px",
          padding: "24px",
        }}
      >
        <h3
          style={{
            margin: "0 0 8px 0",
            color: "#888",
            fontSize: "13px",
            fontWeight: "500",
          }}
        >
          Active Projects
        </h3>
        <div style={{ fontSize: "32px", color: "#4ade80", fontWeight: "600" }}>
          {metrics.activeProjects}
        </div>
      </div>
      <div
        style={{
          backgroundColor: "#0a0a0a",
          border: "1px solid #1f1f1f",
          borderRadius: "12px",
          padding: "24px",
        }}
      >
        <h3
          style={{
            margin: "0 0 8px 0",
            color: "#888",
            fontSize: "13px",
            fontWeight: "500",
          }}
        >
          Field Teams
        </h3>
        <div style={{ fontSize: "32px", color: "#fff", fontWeight: "600" }}>
          {metrics.teams}
        </div>
      </div>
      <div
        style={{
          backgroundColor: "#0a0a0a",
          border: "1px solid #1f1f1f",
          borderRadius: "12px",
          padding: "24px",
        }}
      >
        <h3
          style={{
            margin: "0 0 8px 0",
            color: "#888",
            fontSize: "13px",
            fontWeight: "500",
          }}
        >
          Your Pending Tasks
        </h3>
        <div
          style={{
            fontSize: "32px",
            color: metrics.pendingTasks > 0 ? "#facc15" : "#888",
            fontWeight: "600",
          }}
        >
          {metrics.pendingTasks}
        </div>
      </div>
    </div>
  );
};

export default MetricsGrid;
