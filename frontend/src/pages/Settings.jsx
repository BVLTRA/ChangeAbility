import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Settings = () => {
  const { token, user } = useContext(AuthContext);
  
  // State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [teamRole, setTeamRole] = useState('General Volunteer');
  
  const [theme, setTheme] = useState('dark');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch(`/api/users/${user.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.personal) {
            setFirstName(data.personal.firstName || '');
            setLastName(data.personal.lastName || '');
            setPhone(data.personal.phone || '');
          }
          if (data.teamRole) {
            setTeamRole(data.teamRole);
          }
        }
      } catch (error) {
        console.error('Failed to load profile');
      }
    };
    if (token) loadProfile();
  }, [token, user.id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setStatus('Saving...');
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        // We now include teamRole in the outgoing payload
        body: JSON.stringify({ firstName, lastName, phone, teamRole })
      });
      if (response.ok) {
        setStatus('Profile updated successfully.');
      } else {
        setStatus('Failed to update profile.');
      }
    } catch (error) {
      setStatus('Network error.');
    }
  };

  return (
    <>
      <header className="viewport-header">
        <h1 className="current-page-title">System Settings</h1>
      </header>

      <section className="content-canvas">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          
          <div style={{ backgroundColor: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#fff', fontSize: '15px' }}>Personal Profile</h3>
            <form className="report-form" onSubmit={handleUpdate}>
              {status && <div style={{ color: status.includes('success') ? '#4ade80' : '#facc15', marginBottom: '16px', fontSize: '13px' }}>{status}</div>}
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group full-width">
                  <label>First Name</label>
                  <input type="text" className="form-input" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                </div>
                <div className="form-group full-width">
                  <label>Last Name</label>
                  <input type="text" className="form-input" value={lastName} onChange={e => setLastName(e.target.value)} required />
                </div>
              </div>

              <div className="form-group full-width" style={{ marginTop: '12px' }}>
                <label>Phone Number</label>
                <input type="text" className="form-input" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>

              <div className="form-group full-width" style={{ marginTop: '12px' }}>
                <label>Primary Responsibility</label>
                <select className="form-input" value={teamRole} onChange={(e) => setTeamRole(e.target.value)} style={{ backgroundColor: '#050505', color: '#fff' }}>
                  <option value="General Volunteer">General Volunteer</option>
                  <option value="Logistics & Transport">Logistics & Transport</option>
                  <option value="Kitchen / Food Prep">Kitchen / Food Prep</option>
                  <option value="Field Activations">Field Activations</option>
                  <option value="Medical / Care">Medical / Care</option>
                  <option value="Administrative">Administrative</option>
                </select>
              </div>
              
              <button type="submit" className="btn-primary" style={{ marginTop: '24px', width: '100%' }}>Update Profile</button>
            </form>
          </div>

          <div style={{ backgroundColor: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#fff', fontSize: '15px' }}>Application Preferences</h3>
            <div className="form-group full-width">
              <label>Interface Theme</label>
              <select className="form-input" value={theme} onChange={(e) => setTheme(e.target.value)} style={{ backgroundColor: '#050505', color: '#fff' }}>
                <option value="dark">Dark Mode (Default)</option>
                <option value="light">Light Mode (Coming Soon)</option>
              </select>
              <p style={{ color: '#666', fontSize: '12px', marginTop: '8px' }}>
                * Changing themes dynamically requires updating the global CSS variables. Light mode stylesheet pending.
              </p>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default Settings;