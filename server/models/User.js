const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String },
  role: { type: String, enum: ['Admin', 'Volunteer'], default: 'Volunteer' },
  status: { type: String, enum: ['Pending', 'Active'], default: 'Pending' },
  
  // Profile data (Filled out when the volunteer claims the account)
  personal: {
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    phone: { type: String, default: '' }
  },
  teamRole: { type: String, default: 'Unassigned' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);