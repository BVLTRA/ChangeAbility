import React from 'react';
import './CalendarGrid.css';

const mockEvents = [
  { id: 1, date: 5, title: 'Volunteer Orientation', type: 'event' },
  { id: 2, date: 12, title: 'Food Drive Setup', type: 'activity' },
  { id: 3, date: 18, title: 'Community Outreach', type: 'event' },
  { id: 4, date: 24, title: 'Monthly Review', type: 'meeting' }
];

const CalendarGrid = () => {
  // Mechanical setup for a standard 31-day month starting on a Wednesday (adjust as needed)
  const daysInMonth = 31;
  const startingDayOfWeek = 3; // 0 = Sunday, 3 = Wednesday
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startingDayOfWeek }, (_, i) => i);

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>October 2026</h2>
        <div className="calendar-nav">
          <button className="nav-arrow">&lt;</button>
          <button className="nav-arrow">&gt;</button>
        </div>
      </div>

      <div className="calendar-grid">
        {/* Weekday Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="weekday-header">{day}</div>
        ))}

        {/* Padding for the start of the month */}
        {blanks.map(blank => (
          <div key={`blank-${blank}`} className="calendar-cell empty"></div>
        ))}

        {/* Actual Days */}
        {days.map(day => {
          const dayEvents = mockEvents.filter(e => e.date === day);
          const isToday = day === 17; // Mocking today's date

          return (
            <div key={day} className={`calendar-cell ${isToday ? 'today' : ''}`}>
              <span className="day-number">{day}</span>
              <div className="day-events">
                {dayEvents.map(event => (
                  <div key={event.id} className={`event-pill type-${event.type}`}>
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;