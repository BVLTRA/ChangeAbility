import React, { useState, useEffect } from "react";
import GlowOrbs from "./GlowOrb";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MetricsGrid from "./MetricsGrid";
import ChartsPanel from "./ChartsPanel";
import IssueExplorer from "./IssueExplorer";
import "./Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("gridlock_user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <div className="dashboard-layout">
      <GlowOrbs />
      <Sidebar user={user} />
      
      <main className="main-viewport">
        <Header />
        <section className="content-canvas">
          <MetricsGrid />
          <ChartsPanel />
          <IssueExplorer />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;