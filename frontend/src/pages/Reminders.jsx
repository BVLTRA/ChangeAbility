import React from 'react';
import ReminderList from '../components/dashboard/ReminderList';

const Reminders = () => {
  return (
    <>
      <header className="viewport-header">
        <h1 className="current-page-title">Reminders</h1>
      </header>

      <section className="content-canvas">
        <ReminderList />
      </section>
    </>
  );
};

export default Reminders;