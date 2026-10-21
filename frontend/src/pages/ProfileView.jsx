import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './ProfileView.css';

const ProfileView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
        } else {
          console.error("Failed to load profile");
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [id, token]);

  if (loading) return <div style={{ color: 'white', padding: '40px' }}>Loading profile...</div>;
  if (!profileData) return <div style={{ color: 'white', padding: '40px' }}>User not found.</div>;

  // Formatting variables
  const fullName = profileData.personal?.firstName ? `${profileData.personal.firstName} ${profileData.personal.lastName}` : 'Pending Name';
  const avatarUrl = `https://ui-avatars.com/api/?name=${profileData.email}&background=1f1f1f&color=fff&size=128`;
  const phone = profileData.personal?.phone || 'Not provided';
  const teamRole = profileData.teamRole || 'Unassigned';

  return (
    <>
      <header className="viewport-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate('/people/volunteers')} style={{ background: 'transparent', border: '1px solid #333', color: '#ccc', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer' }}>
            &lt;
          </button>
          <h1 className="current-page-title">Personnel Profile</h1>
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
            <button className={`profile-tab-btn ${activeTab === 'teams' ? 'active' : ''}`} onClick={() => setActiveTab('teams')}>Teams</button>
            <button className={`profile-tab-btn ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>Projects</button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="profile-overview-grid">
            <div className="profile-card">
              <h3 className="profile-card-header">System Information</h3>
              <div className="profile-details-list">
                <div className="detail-row">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{fullName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Mobile:</span>
                  <span className="detail-value">{phone}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{profileData.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Sys Role:</span>
                  <span className="detail-value">{profileData.role}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Team Role:</span>
                  <span className="detail-value">{teamRole}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Account:</span>
                  <span className="detail-value" style={{ color: profileData.status === 'Active' ? '#4ade80' : '#facc15' }}>
                    {profileData.status}
                  </span>
                </div>
              </div>
            </div>
            
            {/* The tasks and team arrays will be wired in Phase 3/4 */}
            <div className="profile-card">
              <h3 className="profile-card-header">Tasks & Schedule</h3>
              <p style={{ color: '#666', fontSize: '13px' }}>Calendar integration pending.</p>
            </div>
            <div className="profile-card">
              <h3 className="profile-card-header">Team Roster</h3>
              <p style={{ color: '#666', fontSize: '13px' }}>Team assignment integration pending.</p>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default ProfileView;