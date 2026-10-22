import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './ReminderList.css';

const ReminderList = () => {
  const { token, user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/events', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          // Keep only Personal Tasks assigned to this specific user
          setTasks(data.filter(e => e.type === 'Task' && e.owner === user.id));
        }
      } catch (error) {
        console.error("Failed to load tasks");
      }
    };
    if (token) fetchTasks();
  }, [token, user.id]);

  const toggleTask = async (id) => {
    // Optimistic UI update for instant feedback
    setTasks(tasks.map(t => t._id === id ? { ...t, completed: !t.completed } : t));

    // Backend sync
    await fetch(`http://localhost:5000/api/events/${id}/toggle`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  };

  const addTask = async (e) => {
    if (e.key === 'Enter' && newTask.trim() !== '') {
      const payload = {
        title: newTask,
        type: 'Task',
        visibility: 'Personal',
        date: new Date().toISOString()
      };

      try {
        const response = await fetch('http://localhost:5000/api/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const savedTask = await response.json();
          setTasks([...tasks, savedTask]);
          setNewTask('');
        }
      } catch (error) {
        console.error("Failed to save quick task");
      }
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
          placeholder="Quick add a new reminder and press Enter..." 
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={addTask}
        />
      </div>

      <div className="task-list">
        {tasks.map(task => {
          const taskDate = new Date(task.date).toLocaleDateString('en-GB');
          return (
            <div key={task._id} className={`task-row ${task.completed ? 'completed' : ''}`}>
              <div className="checkbox-wrapper" onClick={() => toggleTask(task._id)}>
                <div className={`custom-checkbox ${task.completed ? 'checked' : ''}`}>
                  {task.completed && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                </div>
              </div>

              <div className="task-details">
                <span className="task-text">{task.title}</span>
                <div className="task-meta">
                  <span className="task-time">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    {taskDate}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        
        {tasks.length === 0 && <p style={{ color: '#666', fontSize: '13px', textAlign: 'center' }}>No pending tasks.</p>}
      </div>
    </div>
  );
};

export default ReminderList;