import React from 'react';
import './DataTable.css';

const volunteersData = [
  { id: 1, name: 'Esthera Jackson', email: 'esthera@simmmple.com', role: 'Awareness', subRole: 'Vision', status: 'Active', date: '14/06/21', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
  { id: 2, name: 'Alexa Liras', email: 'alexa@simmmple.com', role: 'Awareness', subRole: 'Handicap', status: 'Wait', date: '14/06/21', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  { id: 3, name: 'Laurent Michael', email: 'laurent@simmmple.com', role: 'Chef', subRole: 'Kitchen', status: 'Active', date: '14/06/21', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d' },
  { id: 4, name: 'Freduardo Hill', email: 'freduardo@simmmple.com', role: 'Admin', subRole: 'Accounting', status: 'Active', date: '14/06/21', avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d' },
  { id: 5, name: 'Daniel Thomas', email: 'daniel@simmmple.com', role: 'Team Lead', subRole: 'Activations', status: 'Wait', date: '14/06/21', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026703d' },
  { id: 6, name: 'Mark Wilson', email: 'mark@simmmple.com', role: 'Team Lead', subRole: 'Activations', status: 'Wait', date: '14/06/21', avatar: 'https://i.pravatar.cc/150?u=a04258a2462d826712d' },
];

const Volunteers = () => {
  return (
    <>
      <header className="viewport-header">
        <h1 className="current-page-title">Volunteers</h1>
      </header>

      <section className="content-canvas">
        <div className="table-container">
          <div className="table-header-row">
            <h2>Volunteers Table</h2>
            <button className="filter-btn">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              Filter
            </button>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>People</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last worked</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {volunteersData.map((volunteer) => (
                <tr key={volunteer.id}>
                  <td>
                    <div className="person-cell">
                      <img src={volunteer.avatar} alt={volunteer.name} className="avatar" />
                      <div className="info-stack">
                        <span className="primary-text">{volunteer.name}</span>
                        <span className="secondary-text">{volunteer.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="info-stack">
                      <span className="primary-text">{volunteer.role}</span>
                      <span className="secondary-text">{volunteer.subRole}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-pill status-${volunteer.status.toLowerCase()}`}>
                      {volunteer.status}
                    </span>
                  </td>
                  <td>
                    <span className="date-text">{volunteer.date}</span>
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

export default Volunteers;