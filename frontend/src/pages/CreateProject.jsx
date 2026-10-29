import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const CreateProject = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Planning");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Relational State
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState([]);

  // Data for Selection Lists
  const [availableTeams, setAvailableTeams] = useState([]);
  const [availableBeneficiaries, setAvailableBeneficiaries] = useState([]);

  useEffect(() => {
    // Fetch Teams and Beneficiaries simultaneously to populate the assignment lists
    const fetchData = async () => {
      try {
        const [teamsRes, beneficiariesRes] = await Promise.all([
          fetch("/api/teams", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/beneficiaries", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (teamsRes.ok) setAvailableTeams(await teamsRes.json());
        if (beneficiariesRes.ok)
          setAvailableBeneficiaries(await beneficiariesRes.json());
      } catch (error) {
        console.error("Failed to load relational data");
      }
    };
    if (token) fetchData();
  }, [token]);

  const toggleSelection = (id, list, setList) => {
    if (list.includes(id)) {
      setList(list.filter((itemId) => itemId !== id));
    } else {
      setList([...list, id]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          status,
          startDate,
          endDate,
          assignedTeams: selectedTeams,
          targetBeneficiaries: selectedBeneficiaries,
        }),
      });

      if (response.ok) navigate("/projects");
    } catch (error) {
      console.error("Network error");
    }
  };

  return (
    <>
      <header className="viewport-header">
        <h1 className="current-page-title">Establish Project</h1>
      </header>

      <section className="content-canvas">
        <div className="form-wrapper">
          <form className="report-form" onSubmit={handleSubmit}>
            {/* --- CORE DETAILS --- */}
            <h3 className="section-divider" style={{ marginTop: 0 }}>
              Project Details
            </h3>
            <div className="form-row">
              <div className="form-group">
                <label>Project Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Operational Status</label>
                <select
                  className="form-input"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ backgroundColor: "#050505", color: "#fff" }}
                >
                  <option value="Planning">Planning</option>
                  <option value="Active">Active</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="form-group full-width">
              <label>Objective / Description</label>
              <textarea
                className="form-input textarea"
                rows="2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  className="form-input date-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>End Date (Optional)</label>
                <input
                  type="date"
                  className="form-input date-input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* --- RELATIONAL ASSIGNMENTS --- */}
            <h3 className="section-divider">Resource Allocation</h3>

            <div className="form-row" style={{ alignItems: "flex-start" }}>
              <div className="form-group">
                <label>Assign Teams</label>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    backgroundColor: "#050505",
                    padding: "16px",
                    borderRadius: "8px",
                    border: "1px solid #1f1f1f",
                    maxHeight: "200px",
                    overflowY: "auto",
                  }}
                >
                  {availableTeams.map((team) => (
                    <label
                      key={team._id}
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
                        checked={selectedTeams.includes(team._id)}
                        onChange={() =>
                          toggleSelection(
                            team._id,
                            selectedTeams,
                            setSelectedTeams,
                          )
                        }
                        style={{
                          width: "16px",
                          height: "16px",
                          accentColor: "#3b82f6",
                        }}
                      />
                      {team.name}
                    </label>
                  ))}
                  {availableTeams.length === 0 && (
                    <span style={{ color: "#666", fontSize: "12px" }}>
                      No teams available.
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Target Beneficiaries</label>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    backgroundColor: "#050505",
                    padding: "16px",
                    borderRadius: "8px",
                    border: "1px solid #1f1f1f",
                    maxHeight: "200px",
                    overflowY: "auto",
                  }}
                >
                  {availableBeneficiaries.map((ben) => (
                    <label
                      key={ben.id}
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
                        checked={selectedBeneficiaries.includes(ben.id)}
                        onChange={() =>
                          toggleSelection(
                            ben.id,
                            selectedBeneficiaries,
                            setSelectedBeneficiaries,
                          )
                        }
                        style={{
                          width: "16px",
                          height: "16px",
                          accentColor: "#3b82f6",
                        }}
                      />
                      {ben.name}
                    </label>
                  ))}
                  {availableBeneficiaries.length === 0 && (
                    <span style={{ color: "#666", fontSize: "12px" }}>
                      No beneficiaries found.
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="form-actions" style={{ marginTop: "32px" }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate("/projects")}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Initialize Project
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default CreateProject;
