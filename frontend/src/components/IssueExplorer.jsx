import React, { useState } from "react";
import IssueCard from "./IssueCard";
import "./IssueExplorer.css";

// --- MOCK DATA ---
const statusData = [
  { name: "New", count: 14 },
  { name: "Assigned", count: 8 },
  { name: "In Progress", count: 22 },
  { name: "Resolved", count: 35 },
  { name: "Closed", count: 42 },
];

// --- MOCK DATA ---
const mockIssues = [
  {
    id: "BV-092",
    title: "Conveyor belt 3 motor overheating",
    status: "New",
    severity: "Critical",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  }, // 1 hour ago
  {
    id: "BV-091",
    title: "Calibration error on filler head A",
    status: "Assigned",
    severity: "High",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  }, // 1 day ago
  {
    id: "BV-090",
    title: "Palletizer sensor out of alignment",
    status: "In Progress",
    severity: "Medium",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  }, // 2 days ago
  {
    id: "BV-089",
    title: "Routine lubrication required for line 2",
    status: "New",
    severity: "Low",
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  }, // 4 hours ago
  {
    id: "BV-088",
    title: "Valve casing leak on fermentation tank",
    status: "Resolved",
    severity: "High",
    createdAt: new Date(Date.now() - 432000000).toISOString(),
  }, // 5 days ago
]; 
const statuses = ["New", "Assigned", "In Progress", "Resolved", "Closed"];

const IssueExplorer = () => {
  const [viewMode, setViewMode] = useState("column");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIssues = mockIssues.filter(
    (issue) =>
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="data-explorer-section">
      <div className="explorer-controls">
        <div className="search-bar-wrapper">
          {/* Search Icon SVG */}
          <input
            type="text"
            placeholder="Search issues by ID or Title..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="view-toggles">
          <button className={`toggle-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}>
            {/* List View SVG */}
          </button>
          <button className={`toggle-btn ${viewMode === "column" ? "active" : ""}`} onClick={() => setViewMode("column")}>
            {/* Column View SVG */}
          </button>
        </div>
      </div>

      <div className="explorer-content">
        {viewMode === "column" ? (
          <div className="kanban-board">
            {statuses.map((status) => {
              const columnIssues = filteredIssues.filter((i) => i.status === status);
              const dotClass = `status-dot dot-${status.toLowerCase().replace(" ", "-")}`;

              return (
                <div key={status} className="kanban-column">
                  <div className="kanban-column-header">
                    <div className="header-left">
                      <span className={dotClass}></span>
                      <h4>{status}</h4>
                    </div>
                    <span className="issue-count">{columnIssues.length}</span>
                  </div>
                  <div className="kanban-column-body">
                    {columnIssues.length > 0 ? (
                      columnIssues.map((issue) => <IssueCard key={issue.id} issue={issue} />)
                    ) : (
                      <div className="empty-column-state">No issues under this stage</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="list-view-container">
            <table className="list-view-table">
              <thead>
                <tr><th>ID</th><th>Title</th><th>Status</th><th>Priority</th><th>Created</th></tr>
              </thead>
              <tbody>
                {filteredIssues.map((issue) => (
                  <tr key={issue.id}>
                    <td className="list-id">{issue.id}</td>
                    <td className="list-title">{issue.title}</td>
                    <td><span className={`status-badge stat-${issue.status.toLowerCase().replace(" ", "-")}`}>{issue.status}</span></td>
                    <td><span className={`severity-badge severity-${issue.severity.toLowerCase()}`}>{issue.severity}</span></td>
                    <td className="list-date">{new Date(issue.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueExplorer;