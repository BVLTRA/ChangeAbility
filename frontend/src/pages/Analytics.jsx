import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import './Analytics.css';

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

  const displayValue = end % 1 !== 0 
    ? count.toFixed(1) 
    : Math.floor(count).toLocaleString('en-US');

  return <span className={className}>{prefix}{displayValue}{suffix}</span>;
};

// --- CHANGEABILITY MOCK DATA ---
const statusData = [
  { name: 'Referral', count: 28 },
  { name: 'Assessed', count: 15 },
  { name: 'In Support', count: 42 },
  { name: 'Assisted', count: 85 },
  { name: 'Closed', count: 110 },
];

const vulnerabilityData = [
  { name: 'Routine', value: 120, patternId: 'pattern-low', color: '#4ade80' },
  { name: 'Moderate', value: 85, patternId: 'pattern-medium', color: '#facc15' },
  { name: 'High Need', value: 45, patternId: 'pattern-high', color: '#fb923c' },
  { name: 'Urgent', value: 14, patternId: 'pattern-critical', color: '#ef4444' },
];

const trendData = [
  { date: 'Oct 01', newCases: 5 },
  { date: 'Oct 06', newCases: 12 },
  { date: 'Oct 11', newCases: 8 },
  { date: 'Oct 16', newCases: 15 },
  { date: 'Oct 21', newCases: 9 },
  { date: 'Oct 26', newCases: 18 },
  { date: 'Oct 31', newCases: 6 },
];

const cumulativeData = [
  { date: 'Oct 01', active: 30, assisted: 110 },
  { date: 'Oct 06', active: 38, assisted: 115 },
  { date: 'Oct 11', active: 35, assisted: 124 },
  { date: 'Oct 16', active: 45, assisted: 129 },
  { date: 'Oct 21', active: 42, assisted: 140 },
  { date: 'Oct 26', active: 55, assisted: 146 },
  { date: 'Oct 31', active: 48, assisted: 165 },
];

const vulnerabilityByStatusData = [
  { status: 'Referral', Routine: 12, Moderate: 8, 'High Need': 6, Urgent: 2 },
  { status: 'Assessed', Routine: 5, Moderate: 6, 'High Need': 3, Urgent: 1 },
  { status: 'In Support', Routine: 15, Moderate: 18, 'High Need': 7, Urgent: 2 },
  { status: 'Assisted', Routine: 40, Moderate: 25, 'High Need': 15, Urgent: 5 },
  { status: 'Closed', Routine: 48, Moderate: 28, 'High Need': 14, Urgent: 4 },
];

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
  return (
    <>
      <header className="viewport-header">
        <h1 className="current-page-title">Impact Analytics</h1>
      </header>

      <section className="content-canvas">
        {/* TOP ROW: KPIs */}
        <div className="metrics-grid">
          <div className="metric-card">
            <span className="metric-label">Total Cases Managed</span>
            <AnimatedCounter end={280} className="metric-value" />
          </div>
          <div className="metric-card">
            <span className="metric-label">Assistance Success Rate</span>
            <AnimatedCounter end={78.4} className="metric-value" suffix="%" />
          </div>
          <div className="metric-card">
            <span className="metric-label">Avg Referrals / Day</span>
            <AnimatedCounter end={12.5} className="metric-value" />
          </div>
          <div className="metric-card">
            <span className="metric-label">Urgent Interventions</span>
            <AnimatedCounter end={14} className="metric-value critical-text" />
          </div>
        </div>

        {/* MIDDLE ROW 1: STATUS & SEVERITY (1fr 1fr) */}
        <div className="analytics-grid-row">
          <div className="chart-panel">
            <div className="chart-header">
              <h2>Cases by Status</h2>
              <p>Distribution across community assistance stages</p>
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
              <h2>Vulnerability Assessment</h2>
              <p>Breakdown by level of urgency or need</p>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <SharedDefs />
                  <Pie data={vulnerabilityData} cx="50%" cy="50%" innerRadius={65} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
                    {vulnerabilityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#${entry.patternId})`} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '6px' }} itemStyle={{ color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="donut-legend">
              {vulnerabilityData.map((entry, index) => (
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
              <h2>Referral Intake Trend</h2>
              <p>New cases opened per day (last 30 days)</p>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f1f1f" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#555', fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '6px' }} itemStyle={{ color: '#fff' }} />
                  <Line type="monotone" dataKey="newCases" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#0a0a0a', stroke: '#3b82f6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-panel">
            <div className="chart-header">
              <h2>Active vs Assisted</h2>
              <p>Cumulative impact over the last 30 days</p>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cumulativeData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#fb923c" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAssisted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f1f1f" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#555', fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '6px' }} itemStyle={{ color: '#fff' }} />
                  <Area type="monotone" dataKey="assisted" stroke="#4ade80" strokeWidth={2} fillOpacity={1} fill="url(#colorAssisted)" />
                  <Area type="monotone" dataKey="active" stroke="#fb923c" strokeWidth={2} fillOpacity={1} fill="url(#colorActive)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: STACKED BAR (Full Width) */}
        <div className="analytics-grid-row full-width mt-24">
          <div className="chart-panel" style={{ height: '450px' }}>
            <div className="chart-header">
              <h2>Vulnerability by Status</h2>
              <p>How needs assessment levels distribute across each assistance stage</p>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vulnerabilityByStatusData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                  <SharedDefs />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f1f1f" />
                  <XAxis dataKey="status" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#555', fontSize: 12 }} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '6px' }} itemStyle={{ color: '#fff' }} />
                  <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px', color: '#888' }} />
                  
                  {/*Keys here map directly to keys inside vulnerabilityByStatusData */}
                  <Bar dataKey="Routine" stackId="a" fill="url(#pattern-low)" />
                  <Bar dataKey="Moderate" stackId="a" fill="url(#pattern-medium)" />
                  <Bar dataKey="High Need" stackId="a" fill="url(#pattern-high)" />
                  <Bar dataKey="Urgent" stackId="a" fill="url(#pattern-critical)" radius={[4, 4, 0, 0]} />
                </BarChart>
                
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Analytics;