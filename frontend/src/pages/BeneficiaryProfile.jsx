import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BeneficiaryProfile.css';

const BeneficiaryProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [beneficiary, setBeneficiary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/beneficiaries/${id}`);
        if (response.ok) {
          const data = await response.json();
          setBeneficiary(data);
        }
      } catch (error) {
        console.error("Failed to fetch beneficiary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return <div className="loading-state">Loading profile data...</div>;
  }

  if (!beneficiary) {
    return <div className="loading-state">Beneficiary not found.</div>;
  }

  const { personal, status, vulnerability, disability, mobility, medication, dietary, allergies, emergencyContact } = beneficiary;
  
  // Format Date of Birth
  const dob = personal.dob ? new Date(personal.dob).toLocaleDateString('en-GB') : 'Unknown';
  
  // Generate Avatar
  const avatarUrl = `https://ui-avatars.com/api/?name=${personal.firstName}+${personal.lastName}&background=1f1f1f&color=fff&size=128`;

  return (
    <>
      <header className="viewport-header">
        <div className="header-left-cluster">
          <button className="back-btn" onClick={() => navigate('/people/beneficiaries')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <h1 className="current-page-title">Beneficiary Details</h1>
        </div>
      </header>

      <section className="content-canvas">
        
        {/* --- HERO BANNER & HEADER CARD --- */}
        <div className="profile-cover-banner"></div>
        
        <div className="profile-header-card">
          <div className="profile-identity">
            <img src={avatarUrl} alt={personal.firstName} className="profile-avatar-large" />
            <div className="profile-titles">
              <h2>{personal.firstName} {personal.lastName}</h2>
              <p>ID: {id}</p>
            </div>
          </div>

          <div className="profile-status-cluster">
            <span className={`status-pill status-${status.toLowerCase().replace(' ', '-')}`}>
              {status}
            </span>
            <span className={`status-pill status-${vulnerability.toLowerCase().replace(' ', '-')}`}>
              {vulnerability} Need
            </span>
          </div>
        </div>

        {/* --- 3-COLUMN DATA GRID --- */}
        <div className="profile-overview-grid">
          
          {/* COLUMN 1: Medical & Disability */}
          <div className="profile-card">
            <h3 className="profile-card-header">Medical Profile</h3>
            
            <div className="profile-details-list">
              <div className="detail-row">
                <span className="detail-label">DOB:</span>
                <span className="detail-value">{dob}</span>
              </div>
              <div className="detail-divider"></div>
              <div className="detail-row">
                <span className="detail-label">Disability:</span>
                <span className="detail-value">{disability?.category || 'None'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Condition:</span>
                <span className="detail-value">{disability?.name || 'N/A'}</span>
              </div>
              {disability?.notes && (
                <div className="detail-row block-row">
                  <span className="detail-label">Notes:</span>
                  <p className="detail-text-block">{disability.notes}</p>
                </div>
              )}
              <div className="detail-divider"></div>
              <div className="detail-row">
                <span className="detail-label">Allergies:</span>
                <span className="detail-value alert-text">{allergies?.allergens || 'No known allergies'}</span>
              </div>
              {allergies?.notes && (
                <div className="detail-row block-row">
                  <p className="detail-text-block">{allergies.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* COLUMN 2: Care & Support Requirements */}
          <div className="profile-card">
            <h3 className="profile-card-header">Care Requirements</h3>
            
            <div className="profile-details-list">
              <div className="detail-row">
                <span className="detail-label">Mobility:</span>
                <span className="detail-value">{mobility?.equipment || 'Independent'}</span>
              </div>
              {mobility?.environment && (
                <div className="detail-row">
                  <span className="detail-label">Env. Needs:</span>
                  <span className="detail-value">{mobility.environment}</span>
                </div>
              )}
              <div className="detail-divider"></div>
              <div className="detail-row">
                <span className="detail-label">Diet Texture:</span>
                <span className="detail-value">{dietary?.texture || 'Standard'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Fluids:</span>
                <span className="detail-value">{dietary?.viscosity || 'Standard'}</span>
              </div>
              {dietary?.notes && (
                <div className="detail-row block-row">
                  <span className="detail-label">Diet Notes:</span>
                  <p className="detail-text-block">{dietary.notes}</p>
                </div>
              )}
              <div className="detail-divider"></div>
              <div className="detail-row block-row">
                <span className="detail-label">Medications:</span>
                <span className="detail-value">{medication?.drugName ? `${medication.drugName} (${medication.dose})` : 'None'}</span>
                {medication?.notes && <p className="detail-text-block mt-4">{medication.notes}</p>}
              </div>
            </div>
          </div>

          {/* COLUMN 3: Logistics */}
          <div className="profile-card">
            <h3 className="profile-card-header">Emergency & Logistics</h3>
            
            <div className="profile-details-list">
              <div className="detail-row block-row">
                <span className="detail-label">Emergency Contact:</span>
                <span className="detail-value" style={{color: '#fff', fontWeight: '500', marginTop: '4px'}}>
                  {emergencyContact?.name || 'Not Provided'}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{emergencyContact?.phone || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{emergencyContact?.email || 'N/A'}</span>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default BeneficiaryProfile;