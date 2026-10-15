import React from 'react';
import './Dashboard.css';

const timeAgo = (dateString) => {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  let interval = seconds / 86400; 
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600; 
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60; 
  if (interval > 1) return Math.floor(interval) + "m ago";
  return "Just now";
};

// Translator function for the CSS class
const getVulnerabilityCssClass = (vuln) => {
  const map = { 'Routine': 'low', 'Moderate': 'medium', 'High Need': 'high', 'Urgent': 'critical' };
  return map[vuln] || 'low';
};

const IssueCard = ({ issue }) => {
  const severityClass = `severity-badge severity-${getVulnerabilityCssClass(issue.vulnerability)}`;

  return (
    <div className="issue-card">
      <div className="issue-card-header">
        <span className="issue-id">{issue.id}</span>
        <span className="issue-time">{timeAgo(issue.createdAt)}</span>
      </div>
      <h3 className="issue-title">{issue.title}</h3>
      <div className="issue-card-footer">
        <span className={severityClass}>{issue.vulnerability}</span>
      </div>
    </div>
  );
};

export default IssueCard;