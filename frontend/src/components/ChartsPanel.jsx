import React, { useState, useEffect, useContext } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AuthContext } from '../context/AuthContext';

const SharedDefs = () => (
  <defs>
    <pattern id="pattern-bar" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
      <rect width="6" height="6" fill="#ffffff" fillOpacity="0.05" />
      <line x1="0" y1="0" x2="0" y2="6" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="2" />
    </pattern>
    <pattern id="pattern-low" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)"><rect width="6" height="6" fill="#4ade80" fillOpacity="0.08" /><line x1="0" y1="0" x2="0" y2="6" stroke="#4ade80" strokeOpacity="0.35" strokeWidth="2" /></pattern>
    <pattern id="pattern-medium" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)"><rect width="6" height="6" fill="#facc15" fillOpacity="0.08" /><line x1="0" y1="0" x2="0" y2="6" stroke="#facc15" strokeOpacity="0.35" strokeWidth="2" /></pattern>
    <pattern id="pattern-high" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)"><rect width="6" height="6" fill="#fb923c" fillOpacity="0.08" /><line x1="0" y1="0" x2="0" y2="6" stroke="#fb923c" strokeOpacity="0.35" strokeWidth="2" /></pattern>
    <pattern id="pattern-critical" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)"><rect width="6" height="6" fill="#ef4444" fillOpacity="0.08" /><line x1="0" y1="0" x2="0" y2="6" stroke="#ef4444" strokeOpacity="0.35" strokeWidth="2" /></pattern>
  </defs>
);

const ChartsPanel = () => {
  const { token } = useContext(AuthContext);
  const [statusData, setStatusData] = useState([]);
  const [vulnData, setVulnData] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/beneficiaries', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const beneficiaries = await response.json();
          
          const sCounts = { 'Referral': 0, 'Assessed': 0, 'In Support': 0, 'Assisted': 0, 'Closed': 0 };
          const vCounts = { 'Routine': 0, 'Moderate': 0, 'High Need': 0, 'Urgent': 0 };

          beneficiaries.forEach(b => {
            if (sCounts[b.status] !== undefined) sCounts[b.status]++;
            if (vCounts[b.vulnerability] !== undefined) vCounts[b.vulnerability]++;
          });

          setStatusData(Object.keys(sCounts).map(key => ({ name: key, count: sCounts[key] })));
          
          setVulnData([
            { name: 'Routine', value: vCounts['Routine'], patternId: 'pattern-low', color: '#4ade80' },
            { name: 'Moderate', value: vCounts['Moderate'], patternId: 'pattern-medium', color: '#facc15' },
            { name: 'High Need', value: vCounts['High Need'], patternId: 'pattern-high', color: '#fb923c' },
            { name: 'Urgent', value: vCounts['Urgent'], patternId: 'pattern-critical', color: '#ef4444' },
          ]);
        }
      } catch (error) {
        console.error("Failed to load chart data");
      }
    };
    if (token) fetchChartData();
  }, [token]);

  return (
    <div className="charts-grid">
      <div className="chart-panel bar-panel">
        <div className="chart-header">
          <h2>Cases by Status</h2>
          <p>Live distribution across community assistance stages</p>
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

      <div className="chart-panel donut-panel">
        <div className="chart-header">
          <h2>Vulnerability Assessment</h2>
          <p>Live breakdown by level of urgency or need</p>
        </div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <SharedDefs />
              <Pie data={vulnData} cx="50%" cy="50%" innerRadius={65} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
                {vulnData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#${entry.patternId})`} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '6px' }} itemStyle={{ color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="donut-legend">
          {vulnData.map((entry, index) => (
            <div key={index} className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: entry.color }}></span>
              <span className="legend-label">{entry.name} ({entry.value})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartsPanel;