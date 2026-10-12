import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import "./ChartsPanel.css";

// --- MOCK DATA ---
const statusData = [
  { name: "New", count: 14 },
  { name: "Assigned", count: 8 },
  { name: "In Progress", count: 22 },
  { name: "Resolved", count: 35 },
  { name: "Closed", count: 42 },
];

// --- MOCK DATA ---
const mockIssues = [
  {
    id: "BV-092",
    title: "Conveyor belt 3 motor overheating",
    status: "New",
    severity: "Critical",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  }, // 1 hour ago
  {
    id: "BV-091",
    title: "Calibration error on filler head A",
    status: "Assigned",
    severity: "High",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  }, // 1 day ago
  {
    id: "BV-090",
    title: "Palletizer sensor out of alignment",
    status: "In Progress",
    severity: "Medium",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  }, // 2 days ago
  {
    id: "BV-089",
    title: "Routine lubrication required for line 2",
    status: "New",
    severity: "Low",
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  }, // 4 hours ago
  {
    id: "BV-088",
    title: "Valve casing leak on fermentation tank",
    status: "Resolved",
    severity: "High",
    createdAt: new Date(Date.now() - 432000000).toISOString(),
  }, // 5 days ago
];


const statuses = ["New", "Assigned", "In Progress", "Resolved", "Closed"];

const severityData = [
  { name: "Low", value: 40, patternId: "pattern-low" },
  { name: "Medium", value: 30, patternId: "pattern-medium" },
  { name: "High", value: 15, patternId: "pattern-high" },
  { name: "Critical", value: 5, patternId: "pattern-critical" },
];

const ChartsPanel = () => {
  return (
    <div className="charts-grid">
      <div className="chart-panel bar-panel">
        <div className="chart-header">
          <h2>Issues by status</h2>
          <p>Distribution across workflow stages</p>
        </div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={statusData}
                    margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
                  >
                    {/* Inject the pattern directly into the BarChart's SVG namespace */}
                    <defs>
                      <pattern
                        id="pattern-bar"
                        patternUnits="userSpaceOnUse"
                        width="6"
                        height="6"
                        patternTransform="rotate(45)"
                      >
                        <rect
                          width="6"
                          height="6"
                          fill="#F6861F"
                          fillOpacity="0.05"
                        />
                        <line
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="6"
                          stroke="#F6861F"
                          strokeOpacity="0.75"
                          strokeWidth="2"
                        />
                      </pattern>
                    </defs>

                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#888", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#555", fontSize: 12 }}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(255,255,255,0.05)" }}
                      contentStyle={{
                        backgroundColor: "#111",
                        border: "1px solid #333",
                        borderRadius: "6px",
                      }}
                      itemStyle={{ color: "#fff" }}
                    />

                    <Bar
                      dataKey="count"
                      fill="url(#pattern-bar)"
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-panel donut-panel">
        <div className="chart-header">
          <h2>Severity Distribution</h2>
          <p>Breakdown by severity level</p>
        </div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <defs>
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
          {severityData.map((entry, index) => {
            const colorMap = {
              'pattern-low': '#4ade80ab',
              'pattern-medium': '#facc15a2',
              'pattern-high': '#fb923cbb',
              'pattern-critical': '#ef4444ab'
            };
            return (
              <div key={index} className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: colorMap[entry.patternId] }}></span>
                <span className="legend-label">{entry.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChartsPanel;