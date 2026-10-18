import React, { useState } from 'react';
import './ProfileView.css';

// --- MOCK DATA ---
const profileData = {
  name: 'Esthera Jackson',
  email: 'esthera@changeability.org',
  phone: '(+27) 23 123 4123',
  location: 'Centurion, Gauteng, South Africa',
  role: 'Volunteer Coordinator',
  teamRole: 'Team Lead',
  avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
  bio: 'Hi, I am Esthera. I coordinate the regional volunteer deployments and manage the weekend food drive operations across the Gauteng district.'
};

const mockTasks = [
  { id: 1, title: 'Regional Orientation Session', date: 'Oct 24, 2026', type: 'Event' },
  { id: 2, title: 'Finalize monthly schedules', date: 'Oct 26, 2026', type: 'Task' },
  { id: 3, title: 'Community Outreach - Mamelodi', date: 'Oct 28, 2026', type: 'Event' },
  { id: 4, title: 'Submit supply chain requisitions', date: 'Nov 02, 2026', type: 'Task' },
];

const mockTeam = [
  { id: 1, name: 'Alexa Liras', role: 'Logistics', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  { id: 2, name: 'Laurent Michael', role: 'Chef / Kitchen', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d' },
  { id: 3, name: 'Freduardo Hill', role: 'Accounting', avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d' },
  { id: 4, name: 'Daniel Thomas', role: 'Activations', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026703d' },
];

const ProfileView = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <>
      <header className="viewport-header">
        <h1 className="current-page-title">Profile Overview</h1>
      </header>

      <section className="content-canvas">
        
        {/* --- HERO BANNER & HEADER CARD --- */}
        <div className="profile-cover-banner"></div>
        
        <div className="profile-header-card">
          <div className="profile-identity">
            <img src={profileData.avatar} alt={profileData.name} className="profile-avatar-large" />
            <div className="profile-titles">
              <h2>{profileData.name}</h2>
              <p>{profileData.email}</p>
            </div>
          </div>

          <div className="profile-tabs">
            <button 
              className={`profile-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`profile-tab-btn ${activeTab === 'teams' ? 'active' : ''}`}
              onClick={() => setActiveTab('teams')}
            >
              Teams
            </button>
            <button 
              className={`profile-tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              Projects
            </button>
          </div>
        </div>

        {/* --- OVERVIEW TAB CONTENT --- */}
        {activeTab === 'overview' && (
          <div className="profile-overview-grid">
            
            {/* COLUMN 1: Profile Information */}
            <div className="profile-card">
              <h3 className="profile-card-header">Profile Information</h3>
              <p className="profile-bio">{profileData.bio}</p>
              
              <div className="profile-details-list">
                <div className="detail-row">
                  <span className="detail-label">Full Name:</span>
                  <span className="detail-value">{profileData.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Mobile:</span>
                  <span className="detail-value">{profileData.phone}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{profileData.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">{profileData.location}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Role:</span>
                  <span className="detail-value">{profileData.role}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Team Role:</span>
                  <span className="detail-value">{profileData.teamRole}</span>
                </div>
              </div>
            </div>

            {/* COLUMN 2: Tasks & Calendar Events */}
            <div className="profile-card">
              <h3 className="profile-card-header">Tasks & Schedule</h3>
              <div className="profile-list-container">
                {mockTasks.map(task => (
                  <div key={task.id} className="profile-list-item">
                    <div className="list-item-left">
                      <div className={`event-indicator type-${task.type.toLowerCase()}`}></div>
                      <div className="list-item-text">
                        <h4>{task.title}</h4>
                        <p>{task.date}</p>
                      </div>
                    </div>
                    <span className="list-item-badge">{task.type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 3: Team */}
            <div className="profile-card">
              <h3 className="profile-card-header">Team Roster</h3>
              <div className="profile-list-container">
                {mockTeam.map(member => (
                  <div key={member.id} className="profile-list-item team-item">
                    <div className="list-item-left">
                      <img src={member.avatar} alt={member.name} className="team-avatar-small" />
                      <div className="list-item-text">
                        <h4>{member.name}</h4>
                        <p>{member.role}</p>
                      </div>
                    </div>
                    <button className="view-action-btn">View</button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Placeholders for future tabs */}
        {activeTab === 'teams' && <div className="placeholder-state">Teams module under construction.</div>}
        {activeTab === 'projects' && <div className="placeholder-state">Projects module under construction.</div>}

      </section>
    </>
  );
};

export default ProfileView;