import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
// import ReportIssue from './pages/ReportIssue'; 
import Analytics from './pages/Analytics';
import Account from './pages/Account';
import MainLayout from './components/MainLayout';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Instantly push anyone hitting the root URL into the dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Wrap all routes directly in the layout, bypassing auth guards */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/report-issue" element={<ReportIssue />} /> */}
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/account" element={<Account />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;