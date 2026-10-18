import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Dashboard from './components/Dashboard';
// import ReportIssue from './pages/ReportIssue'; 
import Analytics from './pages/Analytics';
import Volunteers from './pages/Volunteers';
import Beneficiaries from './pages/Beneficiaries';
import CalendarView from './pages/CalendarView';
import Reminders from './pages/Reminders';
import AddBeneficiary from './pages/AddBeneficiary';
import ProfileView from './pages/ProfileView';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/report-issue" element={<ReportIssue />} /> */}
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/people/volunteers" element={<Volunteers />} />
          <Route path="/people/beneficiaries" element={<Beneficiaries />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/add-beneficiary" element={<AddBeneficiary />} />
          <Route path="/profile" element={<ProfileView />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;