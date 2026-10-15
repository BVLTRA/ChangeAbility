import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import GlowOrbs from './GlowOrb';
import './MainLayout.css'; 

const MainLayout = () => {
  return (
    <div className="dashboard-layout">
      <GlowOrbs />
      <Sidebar />
      <main className="main-viewport">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;