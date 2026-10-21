import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const InviteVolunteer = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext); // Extract the JWT

  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Volunteer');
  const [statusMsg, setStatusMsg] = useState('');

  const handleInvite = async (e) => {
    e.preventDefault();
    setStatusMsg('Sending invite...');

    try {
      const response = await fetch('http://localhost:5000/api/auth/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Injecting the wristband
        },
        body: JSON.stringify({ email, role })
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMsg('Success! Invite stub created.');
        setTimeout(() => navigate('/people/volunteers'), 1500);
      } else {
        setStatusMsg(`Error: ${data.error}`);
      }
    } catch (error) {
      setStatusMsg('Network error occurred.');
    }
  };

  return (
    <>
      <header className="viewport-header">
        <h1 className="current-page-title">Invite Personnel</h1>
      </header>

      <section className="content-canvas">
        <div className="form-wrapper" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="form-header">
            <h2>Create Invitation</h2>
            <p>Generate a secure stub account for a new team member.</p>
          </div>

          <form className="report-form" onSubmit={handleInvite}>
            {statusMsg && <div style={{ marginBottom: '16px', color: statusMsg.includes('Error') ? '#ef4444' : '#4ade80' }}>{statusMsg}</div>}
            
            <div className="form-group full-width">
              <label>Email Address</label>
              <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="form-group full-width" style={{ marginTop: '16px' }}>
              <label>System Role</label>
              <select className="form-input" value={role} onChange={(e) => setRole(e.target.value)} style={{ backgroundColor: '#050505', color: '#fff' }}>
                <option value="Volunteer">Volunteer</option>
                <option value="Admin">Administrator</option>
              </select>
            </div>

            <div className="form-actions" style={{ marginTop: '32px' }}>
              <button type="button" className="btn-secondary" onClick={() => navigate('/people/volunteers')}>Cancel</button>
              <button type="submit" className="btn-primary">Generate Invite</button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default InviteVolunteer;