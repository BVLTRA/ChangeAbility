import React, { useEffect, useRef } from 'react';

const GlowOrbs = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Check if the device has a mouse. If not (like on mobile), stop here.
    const isMouseDevice = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isMouseDevice) return;

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      containerRef.current.style.setProperty('--mouse-x', x);
      containerRef.current.style.setProperty('--mouse-y', y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none', 
        zIndex: 0,
        overflow: 'hidden'
      }}
    >
      {/* Orb 1 */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        width: '600px', height: '600px',
        borderRadius: '50%',
        backgroundColor: 'rgba(3, 12, 65, 0.72)',
        filter: 'blur(120px)',
        transform: 'translate(calc(-50% + var(--mouse-x, 0) * 40px), calc(-50% + var(--mouse-y, 0) * 40px))',
        transition: 'transform 0.8s ease-out',
        willChange: 'transform' // Forces GPU acceleration
      }} />

      {/* Orb 2 */}
      <div style={{
        position: 'absolute',
        top: '60%', left: '60%',
        width: '350px', height: '350px',
        borderRadius: '50%',
        backgroundColor: 'rgba(6, 63, 4, 0.36)',
        filter: 'blur(80px)',
        transform: 'translate(calc(-50% + var(--mouse-x, 0) * 90px), calc(-50% + var(--mouse-y, 0) * 90px))',
        transition: 'transform 0.15s ease-out',
        willChange: 'transform' // Forces GPU acceleration
      }} />
    </div>
  );
};

export default GlowOrbs;