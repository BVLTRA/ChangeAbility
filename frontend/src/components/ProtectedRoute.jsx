import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div style={{ color: 'white', padding: '40px' }}>Authenticating...</div>;

  // 1. If they have no token/user, send to login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // 2. If the route is strictly for Admins, and a Volunteer tries to enter, reject them
  if (adminOnly && user.role !== 'Admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // 3. If they pass checks, render the requested page
  return <Outlet />;
};

export default ProtectedRoute;