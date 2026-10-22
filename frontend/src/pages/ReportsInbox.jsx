import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ReportsInbox = () => {
  const { token } = useContext(AuthContext);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/reports", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) setReports(await response.json());
      } catch (error) {
        console.error("Failed to fetch reports");
      }
    };
    if (token) fetchReports();
  }, [token]);

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/reports/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (response.ok) {
        setReports(
          reports.map((r) => (r._id === id ? { ...r, status: newStatus } : r)),
        );
      }
    } catch (error) {
      console.error("Failed to update status");
    }
  };

  return (
    <>
      <header className="viewport-header">
        <h1 className="current-page-title">System Reports Inbox</h1>
      </header>

      <section className="content-canvas">
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {reports.map((report) => (
            <div
              key={report._id}
              style={{
                backgroundColor: "#0a0a0a",
                border: "1px solid #1f1f1f",
                borderRadius: "12px",
                padding: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: "0 0 8px 0",
                      color: "#fff",
                      fontSize: "16px",
                    }}
                  >
                    {report.title}
                  </h3>
                  <span style={{ fontSize: "12px", color: "#888" }}>
                    Submitted by:{" "}
                    {report.submittedBy?.personal?.firstName ||
                      report.submittedBy?.email}{" "}
                    | {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: "600",
                      backgroundColor: "#141414",
                      color: "#aaa",
                    }}
                  >
                    {report.category}
                  </span>
                  <select
                    value={report.status}
                    onChange={(e) => updateStatus(report._id, e.target.value)}
                    style={{
                      backgroundColor:
                        report.status === "Resolved"
                          ? "rgba(74, 222, 128, 0.1)"
                          : "#1a1a1a",
                      color: report.status === "Resolved" ? "#4ade80" : "#fff",
                      border: "1px solid #333",
                      borderRadius: "6px",
                      padding: "4px 8px",
                      fontSize: "12px",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    <option value="Open">Open</option>
                    <option value="In Review">In Review</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
              <p
                style={{
                  margin: 0,
                  color: "#ccc",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  backgroundColor: "#050505",
                  padding: "16px",
                  borderRadius: "8px",
                  border: "1px solid #141414",
                }}
              >
                {report.description}
              </p>
            </div>
          ))}

          {reports.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "#666",
                border: "1px dashed #1f1f1f",
                borderRadius: "12px",
              }}
            >
              Inbox is completely clear.
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ReportsInbox;
