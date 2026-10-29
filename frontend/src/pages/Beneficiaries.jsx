import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DataTable.css";

const Beneficiaries = () => {
  // 1. Initialize an empty array to hold the database data
  const [beneficiaries, setBeneficiaries] = useState([]);
  const navigate = useNavigate();

  // 2. Fetch the data the moment the component mounts
  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        const response = await fetch("/api/beneficiaries");
        const data = await response.json();
        setBeneficiaries(data); // Inject the database response into the state
      } catch (error) {
        console.error("Failed to fetch beneficiaries:", error);
      }
    };

    fetchBeneficiaries();
  }, []);

  return (
    <>
      <header className="viewport-header">
        <h1 className="current-page-title">Beneficiaries</h1>
      </header>

      <section className="content-canvas">
        <div className="table-container">
          <div className="table-header-row">
            <h2>Beneficiaries Table</h2>
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
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>People</th>
                <th>Primary Need</th>
                <th>Status</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/* 3. Map over the live state instead of dummy data */}
              {beneficiaries.map((person) => (
                <tr key={person.id}>
                  <td>
                    <div className="person-cell">
                      <img
                        src={person.avatar}
                        alt={person.name}
                        className="avatar"
                      />
                      <div className="info-stack">
                        <span className="primary-text">{person.name}</span>
                        <span className="secondary-text">{person.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="info-stack">
                      <span className="primary-text">{person.need}</span>
                      <span className="secondary-text">{person.subNeed}</span>
                    </div>
                  </td>
                  <td>
                    {/* The status-pill CSS dynamically colors this based on the word */}
                    <span
                      className={`status-pill status-${person.status.toLowerCase().replace(" ", "-")}`}
                    >
                      {person.status}
                    </span>
                  </td>
                  <td>
                    <span className="date-text">{person.date}</span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="action-btn"
                      onClick={() =>
                        navigate(`/people/beneficiaries/${person.id}`)
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {/* Optional: Show an empty state if the database is empty */}
              {beneficiaries.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "#666",
                    }}
                  >
                    No beneficiaries registered yet.
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

export default Beneficiaries;
