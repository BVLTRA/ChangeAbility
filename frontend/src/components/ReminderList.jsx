import React, { useState } from 'react';
import './ReminderList.css';

const initialReminders = [
  { id: 1, text: 'Finalize quarterly budget report', time: 'Today, 2:00 PM', priority: 'High', completed: false },
  { id: 2, text: 'Email vendor regarding the delayed shipment', time: 'Tomorrow', priority: 'Normal', completed: false },
  { id: 3, text: 'Draft update for the volunteer portal', time: 'Oct 20', priority: 'Normal', completed: true },
  { id: 4, text: 'Review new case assignments', time: 'Oct 22', priority: 'High', completed: false }
];

const ReminderList = () => {
  const [reminders, setReminders] = useState(initialReminders);
  const [newTask, setNewTask] = useState('');

  const toggleReminder = (id) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const addReminder = (e) => {
    if (e.key === 'Enter' && newTask.trim() !== '') {
      const newReminder = {
        id: Date.now(),
        text: newTask,
        time: 'No date',
        priority: 'Normal',
        completed: false
      };
      setReminders([newReminder, ...reminders]);
      setNewTask('');
    }
  };

  return (
    <div className="reminders-container">
      <div className="reminders-header">
        <h2>Personal Tasks</h2>
      </div>

      <div className="add-task-wrapper">
        <svg className="add-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        <input 
          type="text" 
          className="add-task-input" 
          placeholder="Add a new reminder and press Enter..." 
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={addReminder}
        />
      </div>

      <div className="task-list">
        {reminders.map(reminder => (
          <div key={reminder.id} className={`task-row ${reminder.completed ? 'completed' : ''}`}>
            
            <div className="checkbox-wrapper" onClick={() => toggleReminder(reminder.id)}>
              <div className={`custom-checkbox ${reminder.completed ? 'checked' : ''}`}>
                {reminder.completed && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
              </div>
            </div>

            <div className="task-details">
              <span className="task-text">{reminder.text}</span>
              <div className="task-meta">
                <span className="task-time">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  {reminder.time}
                </span>
                {reminder.priority === 'High' && <span className="task-priority">High Priority</span>}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ReminderList;