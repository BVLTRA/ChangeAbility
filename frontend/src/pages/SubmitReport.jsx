import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const SubmitReport = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Beneficiary Data");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, category }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate("/dashboard"), 2000);
      }
    } catch (error) {
      console.error("Network error");
    }
  };

  if (success) {
    return (
      <div
        style={{
          display: "flex",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          color: "#4ade80",
        }}
      >
        <h2>Report submitted successfully. Routing to dashboard...</h2>
      </div>
    );
  }

  return (
    <>
      <header className="viewport-header">
        <h1 className="current-page-title">Report an Issue</h1>
      </header>

      <section className="content-canvas">
        <div
          className="form-wrapper"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          <form className="report-form" onSubmit={handleSubmit}>
            <div className="form-group full-width">
              <label>Issue Category</label>
              <select
                className="form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ backgroundColor: "#050505", color: "#fff" }}
              >
                <option value="Beneficiary Data">
                  Beneficiary Data Inaccuracy
                </option>
                <option value="Team Issue">Team / Personnel Issue</option>
                <option value="Project Issue">Project Logistical Issue</option>
                <option value="General / Other">General / Other</option>
              </select>
            </div>

            <div
              className="form-group full-width"
              style={{ marginTop: "16px" }}
            >
              <label>Brief Title</label>
              <input
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div
              className="form-group full-width"
              style={{ marginTop: "16px" }}
            >
              <label>Detailed Description</label>
              <textarea
                className="form-input textarea"
                rows="5"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Provide as much context as possible..."
              ></textarea>
            </div>

            <div className="form-actions" style={{ marginTop: "32px" }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Submit Report
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default SubmitReport;
