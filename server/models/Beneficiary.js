const mongoose = require('mongoose');

const beneficiarySchema = new mongoose.Schema({
  // Identifiers
  personal: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: Date }
  },
  
  // Operational Metrics (Used most for Analytics page)
  status: {
    type: String,
    enum: ['Referral', 'Assessed', 'In Support', 'Assisted', 'Closed'],
    default: 'Referral'
  },
  vulnerability: {
    type: String,
    enum: ['Routine', 'Moderate', 'High Need', 'Urgent'],
    default: 'Routine'
  },

  // Care Requirements
  disability: {
    category: { type: String },
    name: { type: String },
    notes: { type: String }
  },
  mobility: {
    equipment: { type: String },
    environment: { type: String },
    notes: { type: String }
  },
  medication: {
    drugName: { type: String },
    dose: { type: String },
    notes: { type: String }
  },
  dietary: {
    texture: { type: String },
    viscosity: { type: String },
    supplements: { type: String },
    notes: { type: String }
  },
  allergies: {
    allergens: { type: String },
    notes: { type: String }
  },

  // Logistics
  emergencyContact: {
    name: { type: String },
    phone: { type: String },
    email: { type: String }
  }
}, { 
  timestamps: true // Automatically creates createdAt and updatedAt for our timeAgo functions
});

module.exports = mongoose.model('Beneficiary', beneficiarySchema);