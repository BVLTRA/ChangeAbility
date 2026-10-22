import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const TeamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/teams/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setTeam(data);
        }
      } catch (error) {
        console.error("Failed to load team");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchTeam();
  }, [id, token]);

  if (loading)
    return (
      <div style={{ padding: "40px", color: "#fff" }}>Loading team data...</div>
    );
  if (!team)
    return (
      <div style={{ padding: "40px", color: "#fff" }}>Team not found.</div>
    );

  return (
    <>
      <header
        className="viewport-header"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => navigate("/teams")}
            style={{
              background: "transparent",
              border: "1px solid #333",
              color: "#ccc",
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            &lt;
          </button>
          <h1 className="current-page-title">{team.name}</h1>
        </div>
        {user?.role === "Admin" && (
          <button
            style={{
              background: "transparent",
              border: "1px solid #333",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Edit Team
          </button>
        )}
      </header>

      <section className="content-canvas">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "24px",
          }}
        >
          {/* COLUMN 1: Team Details & Lead */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
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
                  margin: "0 0 12px 0",
                  color: "#fff",
                  fontSize: "15px",
                }}
              >
                Mission Objective
              </h3>
              <p
                style={{
                  margin: 0,
                  color: "#888",
                  fontSize: "13px",
                  lineHeight: "1.5",
                }}
              >
                {team.description || "No mission description provided."}
              </p>
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
                  margin: "0 0 16px 0",
                  color: "#fff",
                  fontSize: "15px",
                }}
              >
                Team Lead
              </h3>
              {team.lead ? (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${team.lead.email}&background=1f1f1f&color=fff`}
                    alt="Lead"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                    }}
                  />
                  <div>
                    <h4
                      style={{
                        margin: "0 0 4px 0",
                        color: "#fff",
                        fontSize: "14px",
                      }}
                    >
                      {team.lead.personal?.firstName}{" "}
                      {team.lead.personal?.lastName}
                    </h4>
                    <span style={{ color: "#666", fontSize: "12px" }}>
                      {team.lead.email}
                    </span>
                  </div>
                </div>
              ) : (
                <p style={{ margin: 0, color: "#666", fontSize: "13px" }}>
                  No lead assigned.
                </p>
              )}
            </div>
          </div>

          {/* COLUMN 2: Roster */}
          <div
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
                alignItems: "center",
                marginBottom: "20px",
                borderBottom: "1px solid #1f1f1f",
                paddingBottom: "12px",
              }}
            >
              <h3 style={{ margin: 0, color: "#fff", fontSize: "15px" }}>
                Active Roster
              </h3>
              <span
                style={{
                  backgroundColor: "#141414",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "#ccc",
                }}
              >
                {team.members.length} Members
              </span>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {team.members.map((member) => (
                <div
                  key={member._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px",
                    backgroundColor: "#050505",
                    border: "1px solid #141414",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <img
                      src={`https://ui-avatars.com/api/?name=${member.email}&background=1f1f1f&color=fff`}
                      alt="Member"
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "6px",
                      }}
                    />
                    <div>
                      <h4
                        style={{
                          margin: "0 0 4px 0",
                          color: "#ccc",
                          fontSize: "13px",
                        }}
                      >
                        {member.personal?.firstName
                          ? `${member.personal.firstName} ${member.personal.lastName}`
                          : member.email}
                      </h4>
                      <span style={{ color: "#666", fontSize: "11px" }}>
                        {member.role}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/people/volunteers/${member._id}`)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#3b82f6",
                      fontSize: "12px",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    View Profile
                  </button>
                </div>
              ))}

              {team.members.length === 0 && (
                <p
                  style={{
                    textAlign: "center",
                    color: "#666",
                    fontSize: "13px",
                    marginTop: "20px",
                  }}
                >
                  No personnel assigned to this team.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TeamDetail;
