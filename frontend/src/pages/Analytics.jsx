import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import GlowOrbs from '../components/GlowOrb';
import './Analytics.css';

import logo from "../assets/images/logo.svg"; 

// --- ANIMATED COUNTER ---
const AnimatedCounter = ({ end, duration = 1500, className, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(ease * end);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  // Format with commas and 1 decimal place if it's a float
  const displayValue = end % 1 !== 0 
    ? count.toFixed(1) 
    : Math.floor(count).toLocaleString('en-US');

  return <span className={className}>{prefix}{displayValue}{suffix}</span>;
};

// --- MOCK DATA ---
const statusData = [
  { name: 'New', count: 14 },
  { name: 'Assigned', count: 8 },
  { name: 'In Progress', count: 22 },
  { name: 'Resolved', count: 35 },
  { name: 'Closed', count: 42 },
];

const severityData = [
  { name: 'Low', value: 40, patternId: 'pattern-low', color: '#4ade80' },
  { name: 'Medium', value: 30, patternId: 'pattern-medium', color: '#facc15' },
  { name: 'High', value: 15, patternId: 'pattern-high', color: '#fb923c' },
  { name: 'Critical', value: 5, patternId: 'pattern-critical', color: '#ef4444' },
];

// Last 30 days simplified to 6 data points for clean rendering
const trendData = [
  { date: 'May 01', newIssues: 3 },
  { date: 'May 06', newIssues: 7 },
  { date: 'May 11', newIssues: 2 },
  { date: 'May 16', newIssues: 8 },
  { date: 'May 21', newIssues: 5 },
  { date: 'May 26', newIssues: 12 },
  { date: 'May 31', newIssues: 4 },
];

const cumulativeData = [
  { date: 'May 01', open: 12, resolved: 42 },
  { date: 'May 06', open: 16, resolved: 45 },
  { date: 'May 11', open: 14, resolved: 49 },
  { date: 'May 16', open: 20, resolved: 51 },
  { date: 'May 21', open: 18, resolved: 58 },
  { date: 'May 26', open: 26, resolved: 62 },
  { date: 'May 31', open: 22, resolved: 77 },
];

const severityByStatusData = [
  { status: 'New', Low: 6, Medium: 4, High: 3, Critical: 1 },
  { status: 'Assigned', Low: 2, Medium: 3, High: 2, Critical: 1 },
  { status: 'In Prog.', Low: 8, Medium: 10, High: 3, Critical: 1 },
  { status: 'Resolved', Low: 10, Medium: 15, High: 8, Critical: 2 },
  { status: 'Closed', Low: 14, Medium: 18, High: 10, Critical: 0 },
];

// Reusable SVG Definitions block so we don't repeat this 3 times
const SharedDefs = () => (
  <defs>
    <pattern id="pattern-bar" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
      <rect width="6" height="6" fill="#ffffff" fillOpacity="0.05" />
      <line x1="0" y1="0" x2="0" y2="6" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="2" />
    </pattern>
    <pattern id="pattern-low" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
      <rect width="6" height="6" fill="#4ade80" fillOpacity="0.08" />
      <line x1="0" y1="0" x2="0" y2="6" stroke="#4ade80" strokeOpacity="0.35" strokeWidth="2" />
    </pattern>
    <pattern id="pattern-medium" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
      <rect width="6" height="6" fill="#facc15" fillOpacity="0.08" />
      <line x1="0" y1="0" x2="0" y2="6" stroke="#facc15" strokeOpacity="0.35" strokeWidth="2" />
    </pattern>
    <pattern id="pattern-high" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
      <rect width="6" height="6" fill="#fb923c" fillOpacity="0.08" />
      <line x1="0" y1="0" x2="0" y2="6" stroke="#fb923c" strokeOpacity="0.35" strokeWidth="2" />
    </pattern>
    <pattern id="pattern-critical" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
      <rect width="6" height="6" fill="#ef4444" fillOpacity="0.08" />
      <line x1="0" y1="0" x2="0" y2="6" stroke="#ef4444" strokeOpacity="0.35" strokeWidth="2" />
    </pattern>
  </defs>
);


const Analytics = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('gridlock_user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <div className="dashboard-layout">
      <GlowOrbs />

      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={logo} alt="Relay Logo" className="brand-logo" height="15" />
          <span className="brand-text">RELAY</span>
        </div>
        <nav className="sidebar-nav">
          <button className="nav-item" onClick={() => navigate('/dashboard')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect></svg>
            Dashboard
          </button>
          <button className="nav-item" onClick={() => navigate('/report-issue')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Report Issue
          </button>
          <button className="nav-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect x="4" y="8" width="16" height="14" rx="2"></rect><path d="M9 14h6"></path><path d="M9 18h6"></path><path d="M12 11v8"></path></svg>
            All Reports
          </button>
          <button className="nav-item active" onClick={() => navigate('/analytics')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            Analytics
          </button>
          <button className="nav-item">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            Settings
          </button>
        </nav>
        <div className="sidebar-user">
          <div className="user-avatar">{user ? user.name.charAt(0) : "U"}</div>
          <div className="user-info">
            <span className="user-name">
              {user ? `${user.name} ${user.surname}` : "User"}
            </span>
          </div>
          <button className="logout-icon">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </aside>

      <main className="main-viewport">
        <header className="viewport-header">
          <h1 className="current-page-title">Analytics</h1>
        </header>

        <section className="content-canvas">
          
          {/* TOP ROW: KPIs */}
          <div className="metrics-grid">
            <div className="metric-card">
              <span className="metric-label">Total Issues</span>
              <AnimatedCounter end={121} className="metric-value" />
            </div>
            <div className="metric-card">
              <span className="metric-label">Resolution Rate</span>
              <AnimatedCounter end={63.6} className="metric-value" suffix="%" />
            </div>
            <div className="metric-card">
              <span className="metric-label">Avg Issues/day</span>
              <AnimatedCounter end={4.2} className="metric-value" />
            </div>
            <div className="metric-card">
              <span className="metric-label">Critical Issues</span>
              <AnimatedCounter end={5} className="metric-value critical-text" />
            </div>
          </div>

          {/* MIDDLE ROW 1: STATUS & SEVERITY (1fr 1fr) */}
          <div className="analytics-grid-row">
            
            <div className="chart-panel">
              <div className="chart-header">
                <h2>Issues by Status</h2>
                <p>Distribution across workflow stages</p>
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                    <SharedDefs />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#555', fontSize: 12 }} />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '6px' }} itemStyle={{ color: '#fff' }} />
                    <Bar dataKey="count" fill="url(#pattern-bar)" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-panel">
              <div className="chart-header">
                <h2>Severity Distribution</h2>
                <p>Breakdown by severity level</p>
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <SharedDefs />
                    <Pie data={severityData} cx="50%" cy="50%" innerRadius={65} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
                      {severityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`url(#${entry.patternId})`} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '6px' }} itemStyle={{ color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="donut-legend">
                {severityData.map((entry, index) => (
                  <div key={index} className="legend-item">
                    <span className="legend-dot" style={{ backgroundColor: entry.color }}></span>
                    <span className="legend-label">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* MIDDLE ROW 2: TRENDS & AREA (1fr 1fr) */}
          <div className="analytics-grid-row mt-24">
            
            <div className="chart-panel">
              <div className="chart-header">
                <h2>Issue Creation Trend</h2>
                <p>New issues reported per day (last 30 days)</p>
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f1f1f" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#555', fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '6px' }} itemStyle={{ color: '#fff' }} />
                    <Line type="monotone" dataKey="newIssues" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#0a0a0a', stroke: '#3b82f6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-panel">
              <div className="chart-header">
                <h2>Open vs Resolved</h2>
                <p>Cumulative counts over the last 30 days</p>
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cumulativeData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      {/* Gradient fades for the area chart */}
                      <linearGradient id="colorOpen" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#fb923c" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f1f1f" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#555', fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '6px' }} itemStyle={{ color: '#fff' }} />
                    <Area type="monotone" dataKey="resolved" stroke="#4ade80" strokeWidth={2} fillOpacity={1} fill="url(#colorResolved)" />
                    <Area type="monotone" dataKey="open" stroke="#fb923c" strokeWidth={2} fillOpacity={1} fill="url(#colorOpen)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* BOTTOM ROW: STACKED BAR (Full Width) */}
          <div className="analytics-grid-row full-width mt-24">
            <div className="chart-panel" style={{ height: '450px' }}>
              <div className="chart-header">
                <h2>Severity by Status</h2>
                <p>How severity levels distribute across each workflow stage</p>
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={severityByStatusData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                    <SharedDefs />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f1f1f" />
                    <XAxis dataKey="status" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#555', fontSize: 12 }} />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '6px' }} itemStyle={{ color: '#fff' }} />
                    <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px', color: '#888' }} />
                    
                    {/* The stackId="a" is what forces them to sit on top of each other instead of side-by-side */}
                    <Bar dataKey="Low" stackId="a" fill="url(#pattern-low)" />
                    <Bar dataKey="Medium" stackId="a" fill="url(#pattern-medium)" />
                    <Bar dataKey="High" stackId="a" fill="url(#pattern-high)" />
                    <Bar dataKey="Critical" stackId="a" fill="url(#pattern-critical)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
};

export default Analytics;