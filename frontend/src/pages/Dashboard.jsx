import React, { useContext } from "react";
import { AuthContext } from '../context/AuthContext';
import '../components/Dashboard.css';
import Header from "../components/dashboard/Header";
import MetricsGrid from "../components/dashboard/MetricsGrid";
import ChartsPanel from "../components/ChartsPanel"; 
import IssueExplorer from "../components/dashboard/IssueExplorer"; 
import ReminderList from "../components/dashboard/ReminderList"; 
import QuickLinks from "../components/dashboard/QuickLinks";
import UpcomingEvents from "../components/dashboard/UpcomingEvents";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Header />
      <section className="content-canvas">
        <MetricsGrid />
        
        <div style={{ marginTop: '24px' }}>
          <ChartsPanel />
        </div>
        
        {/* Lower Dashboard Grid Layout */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: user?.role === 'Admin' ? '2fr 1fr' : '1fr', 
          gap: '24px', 
          marginTop: '24px',
          alignItems: 'stretch' 
        }}>
          
          {/* LEFT COLUMN: Issue Explorer (Admin Only) */}
          {user?.role === 'Admin' && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <IssueExplorer />
            </div>
          )}

          {/* RIGHT COLUMN: Tasks, Links, Schedule */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ReminderList />
            <QuickLinks />
            <div style={{ flex: 1 }}>
              <UpcomingEvents />
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default Dashboard;