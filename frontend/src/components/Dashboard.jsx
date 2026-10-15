import React from "react";
import Header from "./Header";
import MetricsGrid from "./MetricsGrid";
import ChartsPanel from "./ChartsPanel";
import IssueExplorer from "./IssueExplorer";

const Dashboard = () => {
  return (
    <>
      <Header />
      <section className="content-canvas">
        <MetricsGrid />
        <ChartsPanel />
        <IssueExplorer />
      </section>
    </>
  );
};

export default Dashboard;