import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Header = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="viewport-header">
      <div>
        {/* Dynamically greets the user by their first name, falling back to 'Operator' if missing */}
        <h1 className="current-page-title">Welcome back, {user?.firstName || 'Operator'}</h1>
        <p style={{ color: '#888', margin: '4px 0 0 0', fontSize: '13px' }}>
          Here is your operational overview for today.
        </p>
      </div>
      
      {user?.role === 'Admin' && (
        <button 
          onClick={() => navigate('/add-beneficiary')}
          style={{ backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
        >
          + Intake Beneficiary
        </button>
      )}
    </header>
  );
};

export default Header;