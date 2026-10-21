import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./DataTable.css";

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext); // Extract the JWT

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`, // Injecting the wristband
          },
        });
        const data = await response.json();
        setVolunteers(data);
      } catch (error) {
        console.error("Failed to fetch volunteers:", error);
      }
    };

    if (token) fetchVolunteers();
  }, [token]);

  return (
    <>
      <header className="viewport-header">
        <h1 className="current-page-title">Volunteers</h1>
      </header>

      <section className="content-canvas">
        <div className="table-container">
          <div className="table-header-row">
            <h2>Volunteers & Admins</h2>
            <div style={{ display: "flex", gap: "12px" }}>
              <button className="filter-btn">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
                Filter
              </button>
              <button
                className="filter-btn"
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                  borderColor: "#fff",
                }}
                onClick={() => navigate("/invite-volunteer")}
              >
                + Invite
              </button>
            </div>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>People</th>
                <th>Role</th>
                <th>Status</th>
                <th>Added</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((volunteer) => (
                <tr key={volunteer.id}>
                  <td>
                    <div className="person-cell">
                      <img
                        src={volunteer.avatar}
                        alt={volunteer.name}
                        className="avatar"
                      />
                      <div className="info-stack">
                        <span className="primary-text">{volunteer.name}</span>
                        <span className="secondary-text">
                          {volunteer.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="info-stack">
                      <span className="primary-text">{volunteer.role}</span>
                      <span className="secondary-text">
                        {volunteer.subRole}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`status-pill status-${volunteer.status.toLowerCase()}`}
                    >
                      {volunteer.status}
                    </span>
                  </td>
                  <td>
                    <span className="date-text">{volunteer.date}</span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="action-btn"
                      onClick={() =>
                        navigate(`/people/volunteers/${volunteer.id}`)
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {volunteers.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "#666",
                    }}
                  >
                    No personnel records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default Volunteers;
