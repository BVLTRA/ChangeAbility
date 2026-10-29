import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const IssueExplorer = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await fetch('/api/reports', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          // Show only Open issues, max 4
          setIssues(data.filter(i => i.status === 'Open').slice(0, 4));
        }
      } catch (error) {
        console.error("Reports load failed", error);
      }
    };
    if (token) fetchIssues();
  }, [token]);

  return (
    <div style={{ backgroundColor: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, color: '#fff', fontSize: '15px' }}>Action Required: Open Issues</h3>
        <button onClick={() => navigate('/reports')} style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '12px', cursor: 'pointer' }}>View All →</button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {issues.map(issue => (
          <div key={issue._id} style={{ backgroundColor: '#111', padding: '16px', borderRadius: '8px', borderLeft: '3px solid #ef4444' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>{issue.title}</span>
              <span style={{ backgroundColor: '#1a1a1a', color: '#aaa', padding: '2px 8px', borderRadius: '4px', fontSize: '10px' }}>{issue.category}</span>
            </div>
            <p style={{ margin: 0, color: '#888', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {issue.description}
            </p>
          </div>
        ))}
        {issues.length === 0 && <span style={{ color: '#4ade80', fontSize: '13px' }}>All operational issues are resolved.</span>}
      </div>
    </div>
  );
};

export default IssueExplorer;