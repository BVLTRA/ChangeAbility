import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './ProfileView.css';

const ProfileView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [profileData, setProfileData] = useState(null);
  const [userTeams, setUserTeams] = useState([]);
  const [userProjects, setUserProjects] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullProfile = async () => {
      try {
        // 1. Fetch Core Profile
        const userRes = await fetch(`http://localhost:5000/api/users/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (userRes.ok) setProfileData(await userRes.json());

        // 2. Fetch all Teams and filter for this user
        const teamsRes = await fetch(`http://localhost:5000/api/teams`, { headers: { 'Authorization': `Bearer ${token}` } });
        let relevantTeams = [];
        if (teamsRes.ok) {
          const allTeams = await teamsRes.json();
          relevantTeams = allTeams.filter(t => t.members?.some(m => m._id === id) || t.lead?._id === id);
          setUserTeams(relevantTeams);
        }

        // 3. Fetch all Projects and filter for those teams
        const projRes = await fetch(`http://localhost:5000/api/projects`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (projRes.ok) {
          const allProj = await projRes.json();
          const teamIds = relevantTeams.map(t => t._id);
          setUserProjects(allProj.filter(p => p.assignedTeams.some(pt => teamIds.includes(pt._id))));
        }

        // 4. Fetch User's Tasks (Requires Admin or self)
        if (user.role === 'Admin' || user.id === id) {
          const tasksRes = await fetch(`http://localhost:5000/api/events?targetUserId=${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
          if (tasksRes.ok) {
            const events = await tasksRes.json();
            setUserTasks(events.filter(e => e.type === 'Task'));
          }
        }
      } catch (error) {
        console.error("Network error fetching profile stack");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchFullProfile();
  }, [id, token, user.id, user.role]);

  if (loading) return <div style={{ color: 'white', padding: '40px' }}>Analyzing system records...</div>;
  if (!profileData) return <div style={{ color: 'white', padding: '40px' }}>User not found.</div>;

  const fullName = profileData.personal?.firstName ? `${profileData.personal.firstName} ${profileData.personal.lastName}` : 'Pending Name';
  const avatarUrl = `https://ui-avatars.com/api/?name=${profileData.email}&background=1f1f1f&color=fff&size=128`;

  return (
    <>
      <header className="viewport-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate('/people/volunteers')} style={{ background: 'transparent', border: '1px solid #333', color: '#ccc', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer' }}>&lt;</button>
          <h1 className="current-page-title">Personnel File</h1>
        </div>
      </header>

      <section className="content-canvas">
        <div className="profile-cover-banner"></div>
        <div className="profile-header-card">
          <div className="profile-identity">
            <img src={avatarUrl} alt={fullName} className="profile-avatar-large" />
            <div className="profile-titles">
              <h2>{fullName}</h2>
              <p>{profileData.email}</p>
            </div>
          </div>
          <div className="profile-tabs">
            <button className={`profile-tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
            <button className={`profile-tab-btn ${activeTab === 'teams' ? 'active' : ''}`} onClick={() => setActiveTab('teams')}>Teams ({userTeams.length})</button>
            <button className={`profile-tab-btn ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>Projects ({userProjects.length})</button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="profile-overview-grid">
            <div className="profile-card">
              <h3 className="profile-card-header">System Information</h3>
              <div className="profile-details-list">
                <div className="detail-row"><span className="detail-label">Name:</span><span className="detail-value">{fullName}</span></div>
                <div className="detail-row"><span className="detail-label">Mobile:</span><span className="detail-value">{profileData.personal?.phone || 'Not provided'}</span></div>
                <div className="detail-row"><span className="detail-label">Sys Role:</span><span className="detail-value">{profileData.role}</span></div>
                <div className="detail-row"><span className="detail-label">Status:</span><span className="detail-value" style={{ color: profileData.status === 'Active' ? '#4ade80' : '#facc15' }}>{profileData.status}</span></div>
              </div>
            </div>

            <div className="profile-card">
              <h3 className="profile-card-header">Tasks & Schedule</h3>
              <div className="profile-list-container">
                {userTasks.map(task => (
                  <div key={task._id} className="profile-list-item">
                    <div className="list-item-left">
                      <div className={`event-indicator type-task`} style={{ backgroundColor: task.completed ? '#4ade80' : '#3b82f6' }}></div>
                      <div className="list-item-text">
                        <h4 style={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? '#666' : '#fff' }}>{task.title}</h4>
                        <p>{new Date(task.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {userTasks.length === 0 && <span style={{ color: '#666', fontSize: '13px' }}>No active assignments.</span>}
              </div>
            </div>

            <div className="profile-card">
              <h3 className="profile-card-header">Affiliated Teams</h3>
              <div className="profile-list-container">
                {userTeams.map(team => (
                  <div key={team._id} className="profile-list-item team-item">
                    <div className="list-item-left">
                      <div className="list-item-text">
                        <h4>{team.name}</h4>
                        <p>{team.lead?._id === id ? 'Team Lead' : 'Member'}</p>
                      </div>
                    </div>
                    <button className="view-action-btn" onClick={() => navigate(`/teams/${team._id}`)}>View</button>
                  </div>
                ))}
                {userTeams.length === 0 && <span style={{ color: '#666', fontSize: '13px' }}>Not assigned to any teams.</span>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'teams' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
             {userTeams.map(team => (
                <div key={team._id} style={{ backgroundColor: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '24px' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '16px' }}>{team.name}</h3>
                  <p style={{ margin: 0, color: '#888', fontSize: '13px' }}>{team.description || 'No description.'}</p>
                  <button onClick={() => navigate(`/teams/${team._id}`)} style={{ marginTop: '16px', width: '100%', padding: '8px', backgroundColor: '#141414', border: '1px solid #222', color: '#fff', borderRadius: '6px', cursor: 'pointer' }}>View Team</button>
                </div>
             ))}
          </div>
        )}

        {activeTab === 'projects' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
             {userProjects.map(proj => (
                <div key={proj._id} style={{ backgroundColor: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h3 style={{ margin: 0, color: '#fff', fontSize: '16px' }}>{proj.title}</h3>
                    <span style={{ fontSize: '11px', color: '#4ade80', backgroundColor: 'rgba(74,222,128,0.1)', padding: '2px 8px', borderRadius: '4px' }}>{proj.status}</span>
                  </div>
                  <p style={{ margin: 0, color: '#888', fontSize: '13px' }}>{proj.description}</p>
                </div>
             ))}
          </div>
        )}
      </section>
    </>
  );
};

export default ProfileView;