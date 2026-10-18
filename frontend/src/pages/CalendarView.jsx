import React from 'react';
import CalendarGrid from '../components/CalendarGrid';

const CalendarView = () => {
  return (
    <>
      <header className="viewport-header">
        <h1 className="current-page-title">Operations Calendar</h1>
      </header>

      <section className="content-canvas">
        <CalendarGrid />
      </section>
    </>
  );
};

export default CalendarView;