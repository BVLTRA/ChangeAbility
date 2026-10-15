import React, { useState, useEffect } from 'react';

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

  const displayValue = end % 1 !== 0 ? count.toFixed(1) : Math.floor(count).toLocaleString('en-US');
  return <span className={className}>{prefix}{displayValue}{suffix}</span>;
};

const MetricsGrid = () => {
  return (
    <div className="metrics-grid">
      <div className="metric-card">
        <span className="metric-label">Total Cases</span>
        <AnimatedCounter end={121} className="metric-value" />
      </div>
      <div className="metric-card">
        <span className="metric-label">Urgent Needs</span>
        <AnimatedCounter end={5} className="metric-value critical-text" />
      </div>
      <div className="metric-card">
        <span className="metric-label">Active Cases</span>
        <AnimatedCounter end={44} className="metric-value" />
      </div>
      <div className="metric-card">
        <span className="metric-label">Assisted Cases</span>
        <AnimatedCounter end={77} className="metric-value" />
      </div>
    </div>
  );
};

export default MetricsGrid;