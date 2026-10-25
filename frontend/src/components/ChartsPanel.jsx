import React, { useState, useEffect, useContext } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AuthContext } from '../context/AuthContext';

// 1. Unique Patterns strictly for the Bar Chart
const BarDefs = () => (
  <defs>
    <pattern id="bar-ref" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)"><rect width="6" height="6" fill="#3b82f6" fillOpacity="0.1" /><line x1="0" y1="0" x2="0" y2="6" stroke="#3b82f6" strokeOpacity="0.4" strokeWidth="2" /></pattern>
    <pattern id="bar-ass" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)"><rect width="6" height="6" fill="#a855f7" fillOpacity="0.1" /><line x1="0" y1="0" x2="0" y2="6" stroke="#a855f7" strokeOpacity="0.4" strokeWidth="2" /></pattern>
    <pattern id="bar-ins" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)"><rect width="6" height="6" fill="#facc15" fillOpacity="0.1" /><line x1="0" y1="0" x2="0" y2="6" stroke="#facc15" strokeOpacity="0.4" strokeWidth="2" /></pattern>
    <pattern id="bar-ast" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)"><rect width="6" height="6" fill="#4ade80" fillOpacity="0.1" /><line x1="0" y1="0" x2="0" y2="6" stroke="#4ade80" strokeOpacity="0.4" strokeWidth="2" /></pattern>
    <pattern id="bar-clo" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)"><rect width="6" height="6" fill="#6b7280" fillOpacity="0.1" /><line x1="0" y1="0" x2="0" y2="6" stroke="#6b7280" strokeOpacity="0.4" strokeWidth="2" /></pattern>
  </defs>
);

// 2. Unique Patterns strictly for the Pie Chart
const PieDefs = () => (
  <defs>
    <pattern id="pie-low" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)"><rect width="6" height="6" fill="#4ade80" fillOpacity="0.08" /><line x1="0" y1="0" x2="0" y2="6" stroke="#4ade80" strokeOpacity="0.35" strokeWidth="2" /></pattern>
    <pattern id="pie-med" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)"><rect width="6" height="6" fill="#facc15" fillOpacity="0.08" /><line x1="0" y1="0" x2="0" y2="6" stroke="#facc15" strokeOpacity="0.35" strokeWidth="2" /></pattern>
    <pattern id="pie-high" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)"><rect width="6" height="6" fill="#fb923c" fillOpacity="0.08" /><line x1="0" y1="0" x2="0" y2="6" stroke="#fb923c" strokeOpacity="0.35" strokeWidth="2" /></pattern>
    <pattern id="pie-crit" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)"><rect width="6" height="6" fill="#ef4444" fillOpacity="0.08" /><line x1="0" y1="0" x2="0" y2="6" stroke="#ef4444" strokeOpacity="0.35" strokeWidth="2" /></pattern>
  </defs>
);

const STATUS_CONFIG = {
  'Referral': { patternId: 'bar-ref', color: '#3b82f6' },
  'Assessed': { patternId: 'bar-ass', color: '#a855f7' },
  'In Support': { patternId: 'bar-ins', color: '#facc15' },
  'Assisted': { patternId: 'bar-ast', color: '#4ade80' },
  'Closed': { patternId: 'bar-clo', color: '#6b7280' }
};

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

          setStatusData(Object.keys(sCounts).map(key => ({ 
            name: key, 
            count: sCounts[key],
            patternId: STATUS_CONFIG[key].patternId,
            color: STATUS_CONFIG[key].color
          })));
          
          // Filter out values of 0 to ensure Recharts can calculate the Donut slices properly
          const calculatedVulnData = [
            { name: 'Routine', value: vCounts['Routine'], patternId: 'pie-low', color: '#4ade80' },
            { name: 'Moderate', value: vCounts['Moderate'], patternId: 'pie-med', color: '#facc15' },
            { name: 'High Need', value: vCounts['High Need'], patternId: 'pie-high', color: '#fb923c' },
            { name: 'Urgent', value: vCounts['Urgent'], patternId: 'pie-crit', color: '#ef4444' },
          ].filter(item => item.value > 0);

          setVulnData(calculatedVulnData);
        }
      } catch (error) {
        console.error("Failed to load chart data");
      }
    };
    if (token) fetchChartData();
  }, [token]);

  return (
    <div className="charts-grid">
      
      {/* BAR CHART */}
      <div className="chart-panel bar-panel">
        <div className="chart-header">
          <h2>Cases by Status</h2>
          <p>Live distribution across community assistance stages</p>
        </div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
              <BarDefs /> {/* Injected directly inside the BarChart */}
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#555', fontSize: 12 }} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '6px' }} itemStyle={{ color: '#fff' }} />
              
              <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#${entry.patternId})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DONUT CHART */}
      <div className="chart-panel donut-panel">
        <div className="chart-header">
          <h2>Vulnerability Assessment</h2>
          <p>Live breakdown by level of urgency or need</p>
        </div>
        <div className="chart-wrapper">
          {vulnData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <PieDefs /> {/* Injected directly inside the PieChart */}
                <Pie data={vulnData} cx="50%" cy="50%" innerRadius={65} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
                  {vulnData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#${entry.patternId})`} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '6px' }} itemStyle={{ color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: '13px' }}>
              No vulnerability data available.
            </div>
          )}
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