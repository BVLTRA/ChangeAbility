import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

import './ReportIssue.css'; 

// --- CUSTOM DROPDOWN ---
const CustomSelect = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="custom-select-container" ref={dropdownRef}>
      <div className={`custom-select-trigger ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        <span className={value ? 'selected-value' : 'placeholder-value'}>{value || placeholder}</span>
        <svg className={`chevron ${isOpen ? 'open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </div>
      {isOpen && (
        <div className="custom-select-menu">
          {options.map((opt) => (
            <div key={opt} className={`custom-select-option ${value === opt ? 'selected' : ''}`} onClick={() => { onChange(opt); setIsOpen(false); }}>
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AddBeneficiary = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const dateInputRef = useRef(null);
  
  // State Schema
  const [formData, setFormData] = useState({
    // Personal
    name: '', surname: '', dob: '',
    // Disabilities
    disabilityCategory: '', disabilityName: '', disabilityNotes: '',
    // Mobility
    mobilityEquipment: '', mobilityEnvironment: '', mobilityNotes: '',
    // Medications
    medDrugName: '', medDose: '', medNotes: '',
    // Dietary
    dietTexture: '', dietViscosity: '', dietSupplements: '', dietNotes: '',
    // Allergies
    allergens: '', allergyNotes: '',
    // Emergency Contact
    emergencyName: '', emergencyPhone: '', emergencyEmail: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Shoot the data to your local backend
      const response = await fetch('http://localhost:5000/api/beneficiaries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Inject the JWT for authentication
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // If it saves successfully, instantly route the user to the table to see it
        navigate('/people/beneficiaries');
      } else {
        console.error('Failed to save beneficiary to database');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <>
      <header className="viewport-header">
        <h1 className="current-page-title">Register Beneficiary</h1>
      </header>

      <section className="content-canvas">
        <div className="form-wrapper">
          <div className="form-header">
            <h2>Beneficiary Intake Form</h2>
            <p>Log a new individual into the ChangeAbility support network.</p>
          </div>

          <form className="report-form" onSubmit={handleSubmit}>

            {/* --- 1. PERSONAL DETAILS --- */}
            <h3 className="section-divider">Personal Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input type="text" className="form-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Surname</label>
                <input type="text" className="form-input" value={formData.surname} onChange={(e) => setFormData({...formData, surname: e.target.value})} />
              </div>
            </div>
            
            <div className="form-group">
              <label>Date of Birth</label>
              <div className="date-input-wrapper" onClick={() => dateInputRef.current && dateInputRef.current.showPicker()}>
                <input ref={dateInputRef} type="date" className="form-input date-input" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} />
                <svg className="calendar-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
            </div>

            {/* --- 2. DISABILITIES --- */}
            <h3 className="section-divider">Disabilities</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Disability Category</label>
                <CustomSelect 
                  placeholder="Select category..." 
                  options={['Physical', 'Sensory', 'Intellectual', 'Mental', 'Neurological', 'Multiple', 'Other']} 
                  value={formData.disabilityCategory} 
                  onChange={(val) => setFormData({...formData, disabilityCategory: val})} 
                />
              </div>
              <div className="form-group">
                <label>Specific Condition / Name</label>
                <input type="text" className="form-input" value={formData.disabilityName} onChange={(e) => setFormData({...formData, disabilityName: e.target.value})} />
              </div>
            </div>
            <div className="form-group full-width">
              <label>Clinical Notes</label>
              <textarea className="form-input textarea" rows="2" value={formData.disabilityNotes} onChange={(e) => setFormData({...formData, disabilityNotes: e.target.value})}></textarea>
            </div>

            {/* --- 3. MOBILITY REQUIREMENTS --- */}
            <h3 className="section-divider">Mobility Requirements <span className="optional-tag">(If any)</span></h3>
            <div className="form-row">
              <div className="form-group">
                <label>Assistive Equipment</label>
                <input type="text" className="form-input" placeholder="e.g., Wheelchair, Walker, Cane" value={formData.mobilityEquipment} onChange={(e) => setFormData({...formData, mobilityEquipment: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Environmental Modifications</label>
                <input type="text" className="form-input" placeholder="e.g., Ramps required, Ground floor only" value={formData.mobilityEnvironment} onChange={(e) => setFormData({...formData, mobilityEnvironment: e.target.value})} />
              </div>
            </div>
            <div className="form-group full-width">
              <label>Mobility Notes</label>
              <textarea className="form-input textarea" rows="2" value={formData.mobilityNotes} onChange={(e) => setFormData({...formData, mobilityNotes: e.target.value})}></textarea>
            </div>

            {/* --- 4. MEDICATIONS --- */}
            <h3 className="section-divider">Medications <span className="optional-tag">(If any)</span></h3>
            <div className="form-row">
              <div className="form-group">
                <label>Drug Name</label>
                <input type="text" className="form-input" value={formData.medDrugName} onChange={(e) => setFormData({...formData, medDrugName: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Dose & Frequency</label>
                <input type="text" className="form-input" placeholder="e.g., 50mg twice daily" value={formData.medDose} onChange={(e) => setFormData({...formData, medDose: e.target.value})} />
              </div>
            </div>
            <div className="form-group full-width">
              <label>Medication Notes</label>
              <textarea className="form-input textarea" rows="2" placeholder="Side effects, administration protocols..." value={formData.medNotes} onChange={(e) => setFormData({...formData, medNotes: e.target.value})}></textarea>
            </div>

            {/* --- 5. DIETARY REQUIREMENTS --- */}
            <h3 className="section-divider">Dietary Requirements <span className="optional-tag">(If any)</span></h3>
            <div className="form-row">
              <div className="form-group">
                <label>Food Texture</label>
                <CustomSelect 
                  placeholder="Select texture..." 
                  options={['Standard', 'Soft', 'Minced & Moist', 'Pureed', 'Liquidized']} 
                  value={formData.dietTexture} 
                  onChange={(val) => setFormData({...formData, dietTexture: val})} 
                />
              </div>
              <div className="form-group">
                <label>Fluid Viscosity</label>
                <CustomSelect 
                  placeholder="Select viscosity..." 
                  options={['Thin (Standard)', 'Slightly Thick', 'Mildly Thick', 'Moderately Thick', 'Extremely Thick']} 
                  value={formData.dietViscosity} 
                  onChange={(val) => setFormData({...formData, dietViscosity: val})} 
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Nutritional Supplements</label>
                <input type="text" className="form-input" value={formData.dietSupplements} onChange={(e) => setFormData({...formData, dietSupplements: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Notes on Strong Preferences</label>
                <input type="text" className="form-input" value={formData.dietNotes} onChange={(e) => setFormData({...formData, dietNotes: e.target.value})} />
              </div>
            </div>

            {/* --- 6. ALLERGIES --- */}
            <h3 className="section-divider">Allergies <span className="optional-tag">(If any)</span></h3>
            <div className="form-group full-width">
              <label>Known Allergens</label>
              <input type="text" className="form-input" placeholder="e.g., Peanuts, Penicillin, Latex" value={formData.allergens} onChange={(e) => setFormData({...formData, allergens: e.target.value})} />
            </div>
            <div className="form-group full-width">
              <label>Allergy Notes / Reaction Type</label>
              <textarea className="form-input textarea" rows="2" value={formData.allergyNotes} onChange={(e) => setFormData({...formData, allergyNotes: e.target.value})}></textarea>
            </div>

            {/* --- 7. EMERGENCY CONTACT --- */}
            <h3 className="section-divider">Emergency Contact <span className="optional-tag">(If any)</span></h3>
            <div className="form-group full-width">
              <label>Name of Contact & Relationship</label>
              <input type="text" className="form-input" placeholder="e.g., Jane Doe (Mother)" value={formData.emergencyName} onChange={(e) => setFormData({...formData, emergencyName: e.target.value})} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" className="form-input" value={formData.emergencyPhone} onChange={(e) => setFormData({...formData, emergencyPhone: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" className="form-input" value={formData.emergencyEmail} onChange={(e) => setFormData({...formData, emergencyEmail: e.target.value})} />
              </div>
            </div>

            {/* --- ACTIONS --- */}
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => navigate('/people/beneficiaries')}>Cancel</button>
              <button type="submit" className="btn-primary">Save Beneficiary</button>
            </div>

          </form>
        </div>
      </section>
    </>
  );
};

export default AddBeneficiary;