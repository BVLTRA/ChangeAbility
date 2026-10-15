import React from 'react';
import './DataTable.css';

const beneficiariesData = [
  { id: 1, name: 'Sipho Ndlovu', email: 'sipho.n@example.com', need: 'Housing Support', subNeed: 'Emergency Placement', status: 'Active', date: '22/10/26', avatar: 'https://i.pravatar.cc/150?u=b042581f4e29026024d' },
  { id: 2, name: 'Lerato Molefe', email: 'lerato.m@example.com', need: 'Food Security', subNeed: 'Monthly Parcel', status: 'Wait', date: '18/10/26', avatar: 'https://i.pravatar.cc/150?u=b042581f4e29026704d' },
  { id: 3, name: 'Amina Patel', email: 'amina.p@example.com', need: 'Medical Transport', subNeed: 'Dialysis Route', status: 'Active', date: '15/10/26', avatar: 'https://i.pravatar.cc/150?u=b04258114e29026702d' },
];

const Beneficiaries = () => {
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
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              Filter
            </button>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>People</th>
                <th>Primary Need</th>
                <th>Status</th>
                <th>Last Contact</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {beneficiariesData.map((person) => (
                <tr key={person.id}>
                  <td>
                    <div className="person-cell">
                      <img src={person.avatar} alt={person.name} className="avatar" />
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
                    <span className={`status-pill status-${person.status.toLowerCase()}`}>
                      {person.status}
                    </span>
                  </td>
                  <td>
                    <span className="date-text">{person.date}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="action-btn">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default Beneficiaries;