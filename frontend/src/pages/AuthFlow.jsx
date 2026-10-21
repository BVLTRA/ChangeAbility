import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './AuthFlow.css'; 

const AuthFlow = () => {
  const { login } = useContext(AuthContext);
  const [mode, setMode] = useState('login'); // 'login' or 'claim'
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/claim';
    
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (mode === 'login') {
        // Pass the token and user payload into our context
        login(data.token, data.user); 
      } else {
        // If they successfully claim, switch them over to the login screen
        setMode('login');
        setPassword('');
        setError('Account activated. Please log in.');
      }

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>ChangeAbility</h2>
          <p>{mode === 'login' ? 'Operator Portal' : 'Activate your account'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className={`auth-alert ${error.includes('activated') ? 'success' : 'error'}`}>{error}</div>}
          
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="auth-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Password {mode === 'claim' && '(Create New)'}</label>
            <input 
              type="password" 
              className="auth-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="auth-submit-btn">
            {mode === 'login' ? 'Authenticate' : 'Set Password & Claim'}
          </button>
        </form>

        <div className="auth-footer">
          <button 
            className="text-toggle-btn" 
            onClick={() => { setMode(mode === 'login' ? 'claim' : 'login'); setError(''); }}
          >
            {mode === 'login' ? 'Have an invite code? Claim account' : 'Already activated? Log in here'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthFlow;