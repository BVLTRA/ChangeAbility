import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CreateEvent = () => {
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [type, setType] = useState('Event');
  const [visibility, setVisibility] = useState('Personal');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, type, visibility, date })
      });

      if (response.ok) {
        navigate(type === 'Task' ? '/reminders' : '/calendar');
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Network error occurred.');
    }
  };

  return (
    <>
      <header className="viewport-header">
        <h1 className="current-page-title">Schedule New Item</h1>
      </header>

      <section className="content-canvas">
        <div className="form-wrapper" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <form className="report-form" onSubmit={handleSubmit}>
            <h3 className="section-divider" style={{ marginTop: 0 }}>Item Details</h3>
            
            {error && <div style={{ color: '#ef4444', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}

            <div className="form-group full-width">
              <label>Title / Description</label>
              <input type="text" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className="form-row" style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label>Type</label>
                <select className="form-input" value={type} onChange={(e) => setType(e.target.value)} style={{ backgroundColor: '#050505', color: '#fff' }}>
                  <option value="Event">Event</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Task">Task (Reminder)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date & Time</label>
                <input type="datetime-local" className="form-input date-input" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
            </div>

            {user?.role === 'Admin' && (
              <div className="form-group full-width" style={{ marginTop: '16px' }}>
                <label>Visibility Clearance</label>
                <select className="form-input" value={visibility} onChange={(e) => setVisibility(e.target.value)} style={{ backgroundColor: '#050505', color: '#fff' }}>
                  <option value="Personal">Personal (Only visible to you & Admins)</option>
                  <option value="Global">Global (Visible to all Volunteers)</option>
                </select>
              </div>
            )}

            <div className="form-actions" style={{ marginTop: '32px' }}>
              <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
              <button type="submit" className="btn-primary">Save to Calendar</button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default CreateEvent;