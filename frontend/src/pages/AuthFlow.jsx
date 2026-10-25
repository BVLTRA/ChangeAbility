import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './AuthFlow.css'; 

const AuthFlow = () => {
  const { login } = useContext(AuthContext);
  const [mode, setMode] = useState('login'); // 'login' or 'claim'
  
  // Auth State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Profile State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [teamRole, setTeamRole] = useState('General Volunteer');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/claim';
    const payload = mode === 'login' 
      ? { email, password } 
      : { email, password, firstName, lastName, phone, teamRole };
    
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Authentication failed');

      if (mode === 'login') {
        login(data.token, data.user); 
      } else {
        setMode('login');
        setPassword('');
        setError('Account activated. Please log in.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'claim' : 'login');
    setError('');
  };

  return (
    <div className="auth-split-layout">
      {/* LEFT PANEL: Duotone Photographic Branding Panel with SVG Swoosh Divider */}
      <div className="auth-brand-panel">
        <div className="brand-panel-image"></div>
        <div className="brand-content">
          <h1 className="brand-title">ChangeAbility</h1>
          <p className="brand-subtitle">The drive for community change</p>
        </div>

        {/* The organic curved swoosh divider from reference */}
        <div className="swoosh-divider">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M100,0 C80,20 85,50 65,70 C50,85 100,100 100,100 Z" fill="#faf8f6" />
          </svg>
        </div>
      </div>

      {/* RIGHT PANEL: Authentication Form */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          
          {/* Logo */}
          <div className="form-brand">
            <h1 className="form-brand-logo">change<span>.ability</span></h1>
            <p className="form-brand-tagline">Operations & Field Management</p>
          </div>

          <form onSubmit={handleSubmit} className="modern-form">
            {error && (
              <div className={`form-alert ${error.includes('activated') ? 'alert-success' : 'alert-error'}`}>
                {error.includes('activated') ? '✅ ' : '⚠️ '} {error}
              </div>
            )}
            
            <div className="input-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <input type="email" className="modern-input" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            {/* EXPANDED PROFILE CLAIM FIELDS */}
            {mode === 'claim' && (
              <div className="claim-fields-animate">
                <div className="input-row">
                  <div className="input-group">
                    <label>First Name</label>
                    <input type="text" className="modern-input no-left-icon" placeholder="Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                  </div>
                  <div className="input-group">
                    <label>Last Name</label>
                    <input type="text" className="modern-input no-left-icon" placeholder="Surname" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                  </div>
                </div>

                <div className="input-group">
                  <label>Mobile Number</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    <input type="text" className="modern-input" placeholder="082 123 4567" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  </div>
                </div>

                <div className="input-group">
                  <label>Primary Responsibility</label>
                  <div className="input-wrapper">
                    <select className="modern-input no-left-icon select-input" value={teamRole} onChange={(e) => setTeamRole(e.target.value)}>
                      <option value="General Volunteer">General Volunteer</option>
                      <option value="Logistics & Transport">Logistics & Transport</option>
                      <option value="Kitchen / Food Prep">Kitchen / Food Prep</option>
                      <option value="Field Activations">Field Activations</option>
                      <option value="Medical / Care">Medical / Care</option>
                      <option value="Administrative">Administrative</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            
            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <input type={showPassword ? "text" : "password"} className="modern-input" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" className="password-toggle-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Checkbox and Forgot Password (Login Mode only) */}
            {mode === 'login' && (
              <div className="form-sub-row">
                <label className="remember-me-checkbox">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" className="forgot-password-link">Forgot password?</a>
              </div>
            )}

            <button type="submit" className="modern-submit-btn" disabled={isLoading}>
              {isLoading ? (
                <span className="btn-loading">Processing...</span>
              ) : (
                mode === 'login' ? 'Log in' : 'Complete Setup & Claim'
              )}
            </button>
          </form>

          {/* Form Toggle Footer */}
          <div className="form-footer">
            <p>
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button className="toggle-mode-btn" onClick={toggleMode}>
                {mode === 'login' ? 'Claim invitation' : 'Log in here'}
              </button>
            </p>
          </div>

          {/* Interface Footer */}
          <div className="auth-ui-footer">
            <button className="ui-footer-link">English (US) ▾</button>
            <button className="ui-footer-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              Get Support
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthFlow;