import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import AuthFlow from './pages/AuthFlow';
import MainLayout from './components/MainLayout';
import Dashboard from './components/Dashboard';
// import ReportIssue from './pages/ReportIssue'; 
import Analytics from './pages/Analytics';
import InviteVolunteer from './pages/InviteVolunteer';
import Volunteers from './pages/Volunteers';
import Beneficiaries from './pages/Beneficiaries';
import CalendarView from './pages/CalendarView';
import Reminders from './pages/Reminders';
import AddBeneficiary from './pages/AddBeneficiary';
import ProfileView from './pages/ProfileView';
import BeneficiaryProfile from './pages/BeneficiaryProfile';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Auth Route */}
          <Route path="/auth" element={<AuthFlow />} />
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Protected Routes Block */}
          {/* Wrap MainLayout inside ProtectedRoute so the Sidebar only loads if logged in */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/people/volunteers" element={<Volunteers />} />
              <Route path="/people/beneficiaries" element={<Beneficiaries />} />
              <Route path="/people/beneficiaries/:id" element={<BeneficiaryProfile />} />
              <Route path="/profile" element={<ProfileView />} />
              <Route path="/calendar" element={<CalendarView />} />
              <Route path="/reminders" element={<Reminders />} />
              
              {/* Admin-only route inside the protected layout */}
              <Route element={<ProtectedRoute adminOnly={true} />}>
                <Route path="/add-beneficiary" element={<AddBeneficiary />} />
                <Route path="/invite-volunteer" element={<InviteVolunteer />} />
              </Route>
            </Route>
          </Route>

        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;