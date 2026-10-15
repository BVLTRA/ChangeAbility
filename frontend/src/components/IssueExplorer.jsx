import React, { useState } from 'react';
import IssueCard from './IssueCard';

const mockCases = [
  { id: 'CA-092', title: 'Emergency food parcel request - Mamelodi', status: 'Referral', vulnerability: 'Urgent', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'CA-091', title: 'Counseling support for domestic incident', status: 'Assessed', vulnerability: 'High Need', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'CA-090', title: 'School uniform assistance required', status: 'In Support', vulnerability: 'Moderate', createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: 'CA-089', title: 'Routine check-in for elderly resident', status: 'Referral', vulnerability: 'Routine', createdAt: new Date(Date.now() - 14400000).toISOString() },
  { id: 'CA-088', title: 'Housing repair intervention', status: 'Assisted', vulnerability: 'High Need', createdAt: new Date(Date.now() - 432000000).toISOString() },
];

const statuses = ['Referral', 'Assessed', 'In Support', 'Assisted', 'Closed'];

// Translator functions to keep your CSS untouched
const getStatusCssClass = (status) => {
  const map = { 'Referral': 'new', 'Assessed': 'assigned', 'In Support': 'in-progress', 'Assisted': 'resolved', 'Closed': 'closed' };
  return map[status] || 'new';
};

const getVulnerabilityCssClass = (vuln) => {
  const map = { 'Routine': 'low', 'Moderate': 'medium', 'High Need': 'high', 'Urgent': 'critical' };
  return map[vuln] || 'low';
};

const IssueExplorer = () => {
  const [viewMode, setViewMode] = useState('column');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCases = mockCases.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="data-explorer-section">
      <div className="explorer-controls">
        <div className="search-bar-wrapper">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            placeholder="Search cases by ID or Title..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="view-toggles">
          <button className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <button className={`toggle-btn ${viewMode === 'column' ? 'active' : ''}`} onClick={() => setViewMode('column')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="18" rx="1"></rect><rect x="14" y="3" width="7" height="18" rx="1"></rect></svg>
          </button>
        </div>
      </div>

      <div className="explorer-content">
        {viewMode === 'column' ? (
          <div className="kanban-board">
            {statuses.map(status => {
              const columnCases = filteredCases.filter(c => c.status === status);
              const dotClass = `status-dot dot-${getStatusCssClass(status)}`;

              return (
                <div key={status} className="kanban-column">
                  <div className="kanban-column-header">
                    <div className="header-left">
                      <span className={dotClass}></span>
                      <h4>{status}</h4>
                    </div>
                    <span className="issue-count">{columnCases.length}</span>
                  </div>
                  
                  <div className="kanban-column-body">
                    {columnCases.length > 0 ? (
                      columnCases.map(caseItem => (
                        <IssueCard key={caseItem.id} issue={caseItem} />
                      ))
                    ) : (
                      <div className="empty-column-state">No cases under this stage</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="list-view-container">
            <table className="list-view-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Vulnerability</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map(caseItem => (
                  <tr key={caseItem.id}>
                    <td className="list-id">{caseItem.id}</td>
                    <td className="list-title">{caseItem.title}</td>
                    <td>
                      <span className={`status-badge stat-${getStatusCssClass(caseItem.status)}`}>
                        {caseItem.status}
                      </span>
                    </td>
                    <td>
                      <span className={`severity-badge severity-${getVulnerabilityCssClass(caseItem.vulnerability)}`}>
                        {caseItem.vulnerability}
                      </span>
                    </td>
                    <td className="list-date">
                      {new Date(caseItem.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueExplorer;