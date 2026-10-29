import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const CreateTeam = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [lead, setLead] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const [availableUsers, setAvailableUsers] = useState([]);

  useEffect(() => {
    // Pull the staff roster to populate our selection lists
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setAvailableUsers(data);
        }
      } catch (error) {
        console.error("Failed to load users");
      }
    };
    if (token) fetchUsers();
  }, [token]);

  const toggleMember = (id) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers(selectedMembers.filter((memberId) => memberId !== id));
    } else {
      setSelectedMembers([...selectedMembers, id]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          lead,
          members: selectedMembers,
        }),
      });

      if (response.ok) {
        navigate("/teams");
      }
    } catch (error) {
      console.error("Network error");
    }
  };

  return (
    <>
      <header className="viewport-header">
        <h1 className="current-page-title">Build a Team</h1>
      </header>

      <section className="content-canvas">
        <div className="form-wrapper">
          <form className="report-form" onSubmit={handleSubmit}>
            <h3 className="section-divider" style={{ marginTop: 0 }}>
              Team Details
            </h3>

            <div className="form-group full-width">
              <label>Team Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Mission / Description</label>
              <textarea
                className="form-input textarea"
                rows="2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <h3 className="section-divider">Personnel Assignment</h3>

            <div className="form-group full-width">
              <label>Team Lead (Optional)</label>
              <select
                className="form-input"
                value={lead}
                onChange={(e) => setLead(e.target.value)}
                style={{ backgroundColor: "#050505", color: "#fff" }}
              >
                <option value="">-- Select a Leader --</option>
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group full-width">
              <label>Assign Members</label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  backgroundColor: "#050505",
                  padding: "16px",
                  borderRadius: "8px",
                  border: "1px solid #1f1f1f",
                }}
              >
                {availableUsers.map((user) => (
                  <label
                    key={user.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      cursor: "pointer",
                      fontSize: "13px",
                      color: "#ccc",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(user.id)}
                      onChange={() => toggleMember(user.id)}
                      style={{
                        width: "16px",
                        height: "16px",
                        accentColor: "#3b82f6",
                      }}
                    />
                    {user.name}{" "}
                    <span style={{ color: "#666", fontSize: "11px" }}>
                      — {user.email}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-actions" style={{ marginTop: "32px" }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate("/teams")}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Create Team
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default CreateTeam;
