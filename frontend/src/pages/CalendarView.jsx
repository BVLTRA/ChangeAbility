import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import CalendarGrid from '../components/CalendarGrid';

const CalendarView = () => {
  const navigate = useNavigate(); 

  return (
    <>
      <header className="viewport-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1 className="current-page-title">Operations Calendar</h1>
        <button 
          onClick={() => navigate('/create-event')}
          style={{ backgroundColor: '#fff', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
        >
          + Add Event
        </button>
      </header>

      <section className="content-canvas">
        <CalendarGrid />
      </section>
    </>
  );
};

export default CalendarView;