import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Projects = () => {
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (error) {
        console.error("Failed to fetch projects");
      }
    };
    if (token) fetchProjects();
  }, [token]);

  // Helper to color-code the status pills
  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return {
          bg: "rgba(74, 222, 128, 0.1)",
          color: "#4ade80",
          border: "rgba(74,222,128,0.2)",
        };
      case "Planning":
        return {
          bg: "rgba(59, 130, 246, 0.1)",
          color: "#3b82f6",
          border: "rgba(59,130,246,0.2)",
        };
      case "On Hold":
        return {
          bg: "rgba(250, 204, 21, 0.1)",
          color: "#facc15",
          border: "rgba(250,204,21,0.2)",
        };
      case "Completed":
        return { bg: "#1a1a1a", color: "#888", border: "#333" };
      default:
        return { bg: "#1a1a1a", color: "#888", border: "#333" };
    }
  };

  return (
    <>
      <header
        className="viewport-header"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <h1 className="current-page-title">Operations Projects</h1>
        {user?.role === "Admin" && (
          <button
            onClick={() => navigate("/create-project")}
            style={{
              backgroundColor: "#fff",
              color: "#000",
              border: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            + New Project
          </button>
        )}
      </header>

      <section className="content-canvas">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          {projects.map((project) => {
            const statusStyle = getStatusStyle(project.status);

            return (
              <div
                key={project._id}
                style={{
                  backgroundColor: "#0a0a0a",
                  border: "1px solid #1f1f1f",
                  borderRadius: "12px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 8px 0",
                      color: "#fff",
                      fontSize: "16px",
                    }}
                  >
                    {project.title}
                  </h3>
                  <span
                    style={{
                      backgroundColor: statusStyle.bg,
                      color: statusStyle.color,
                      border: `1px solid ${statusStyle.border}`,
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                    }}
                  >
                    {project.status}
                  </span>
                </div>

                <p
                  style={{
                    margin: 0,
                    color: "#888",
                    fontSize: "13px",
                    lineHeight: "1.5",
                  }}
                >
                  {project.description || "No description provided."}
                </p>

                <div
                  style={{
                    borderTop: "1px dashed #1f1f1f",
                    paddingTop: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "13px",
                    }}
                  >
                    <span style={{ color: "#666" }}>Assigned Teams:</span>
                    <span style={{ color: "#ccc" }}>
                      {project.assignedTeams?.length || 0}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "13px",
                    }}
                  >
                    <span style={{ color: "#666" }}>Target Beneficiaries:</span>
                    <span style={{ color: "#ccc" }}>
                      {project.targetBeneficiaries?.length || 0}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => console.log("Navigate to project details")}
                  style={{
                    marginTop: "auto",
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#141414",
                    border: "1px solid #222",
                    color: "#fff",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "0.2s",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#1a1a1a")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "#141414")
                  }
                >
                  View Directives
                </button>
              </div>
            );
          })}

          {projects.length === 0 && (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "40px",
                color: "#666",
                border: "1px dashed #1f1f1f",
                borderRadius: "12px",
              }}
            >
              No projects initialized.
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Projects;
