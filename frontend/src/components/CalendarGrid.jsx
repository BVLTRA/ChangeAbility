import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './CalendarGrid.css';

const CalendarGrid = () => {
  const { token } = useContext(AuthContext);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          // Filter out checklist tasks, keeping only Calendar-worthy items
          setEvents(data.filter(e => e.type !== 'Task'));
        }
      } catch (error) {
        console.error("Failed to load events");
      }
    };
    if (token) fetchEvents();
  }, [token]);

  // Calendar Mechanics
  const currentDate = new Date(); // Currently tracking live month
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const startingDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startingDayOfWeek }, (_, i) => i);
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>{monthName}</h2>
        <div className="calendar-nav">
          <button className="nav-arrow">&lt;</button>
          <button className="nav-arrow">&gt;</button>
        </div>
      </div>

      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="weekday-header">{day}</div>
        ))}

        {blanks.map(blank => (
          <div key={`blank-${blank}`} className="calendar-cell empty"></div>
        ))}

        {days.map(day => {
          // Find events that happen on this specific day
          const dayEvents = events.filter(e => {
            const eventDate = new Date(e.date);
            return eventDate.getDate() === day && eventDate.getMonth() === currentDate.getMonth();
          });
          
          const isToday = day === currentDate.getDate();

          return (
            <div key={day} className={`calendar-cell ${isToday ? 'today' : ''}`}>
              <span className="day-number">{day}</span>
              <div className="day-events">
                {dayEvents.map(event => (
                  <div key={event._id} className={`event-pill type-${event.type.toLowerCase()}`}>
                    {event.visibility === 'Global' ? '🌐 ' : ''}{event.title}
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