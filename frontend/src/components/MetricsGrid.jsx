import React, { useState, useEffect } from "react";
import "./MetricsGrid.css";

const AnimatedCounter = ({ end, duration = 1500, className }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(ease * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span className={className}>{count}</span>;
};

const MetricsGrid = () => (
  <div className="metrics-grid">
    <div className="metric-card">
      <span className="metric-label">Total Issues</span>
      <AnimatedCounter end={121} className="metric-value" />
    </div>
    <div className="metric-card">
      <span className="metric-label">Critical Issues</span>
      <AnimatedCounter end={5} className="metric-value critical-text" />
    </div>
    <div className="metric-card">
      <span className="metric-label">Open Issues</span>
      <AnimatedCounter end={44} className="metric-value" />
    </div>
    <div className="metric-card">
      <span className="metric-label">Resolved Issues</span>
      <AnimatedCounter end={77} className="metric-value" />
    </div>
  </div>
);

export default MetricsGrid;