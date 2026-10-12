import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthFlow from './pages/AuthFlow';
import Dashboard from './components/Dashboard';
import Analytics from './pages/Analytics';
import Account from './pages/Account';
import ProtectedRoute from './components/ProtectedRoute';

const isAuthenticated = () => {
  return !!localStorage.getItem('gridlock_token');
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <AuthFlow />} />
        
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />

        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default App;