import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Teams = () => {
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("/api/teams", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setTeams(data);
        }
      } catch (error) {
        console.error("Failed to fetch teams");
      }
    };
    if (token) fetchTeams();
  }, [token]);

  return (
    <>
      <header
        className="viewport-header"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <h1 className="current-page-title">Operations Teams</h1>
        {user?.role === "Admin" && (
          <button
            onClick={() => navigate("/create-team")}
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
            + New Team
          </button>
        )}
      </header>

      <section className="content-canvas">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {teams.map((team) => (
            <div
              key={team._id}
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
              <div>
                <h3
                  style={{
                    margin: "0 0 4px 0",
                    color: "#fff",
                    fontSize: "16px",
                  }}
                >
                  {team.name}
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: "#888",
                    fontSize: "13px",
                    lineHeight: "1.4",
                  }}
                >
                  {team.description || "No description provided."}
                </p>
              </div>

              <div
                style={{
                  borderTop: "1px dashed #1f1f1f",
                  paddingTop: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "13px",
                  }}
                >
                  <span style={{ color: "#666" }}>Lead:</span>
                  <span style={{ color: "#ccc" }}>
                    {team.lead
                      ? `${team.lead.personal.firstName} ${team.lead.personal.lastName}`
                      : "Unassigned"}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "13px",
                  }}
                >
                  <span style={{ color: "#666" }}>Members:</span>
                  <span style={{ color: "#ccc" }}>
                    {team.members.length} Active
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/teams/${team._id}`)}
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
                onMouseOut={(e) => (e.target.style.backgroundColor = "#141414")}
              >
                View Roster
              </button>
            </div>
          ))}

          {teams.length === 0 && (
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
              No teams established yet.
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Teams;
