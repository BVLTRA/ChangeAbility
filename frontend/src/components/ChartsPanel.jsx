import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// --- CHANGEABILITY MOCK DATA ---
const statusData = [
  { name: 'Referral', count: 14 },
  { name: 'Assessed', count: 8 },
  { name: 'In Support', count: 22 },
  { name: 'Assisted', count: 35 },
  { name: 'Closed', count: 42 },
];

const vulnerabilityData = [
  { name: 'Routine', value: 40, patternId: 'pattern-low', color: '#4ade80' },
  { name: 'Moderate', value: 30, patternId: 'pattern-medium', color: '#facc15' },
  { name: 'High Need', value: 15, patternId: 'pattern-high', color: '#fb923c' },
  { name: 'Urgent', value: 5, patternId: 'pattern-critical', color: '#ef4444' },
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

const ChartsPanel = () => {
  return (
    <div className="charts-grid">
      {/* BAR CHART */}
      <div className="chart-panel bar-panel">
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

      {/* DONUT CHART */}
      <div className="chart-panel donut-panel">
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
  );
};

export default ChartsPanel;