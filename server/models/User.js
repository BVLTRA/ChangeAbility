const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true
  },
  password: { 
    type: String, 
    // Not required initially because the Admin creates a "stub" account first
  },
  role: {
    type: String,
    enum: ['Admin', 'Volunteer'],
    default: 'Volunteer'
  },
  status: {
    type: String,
    enum: ['Pending', 'Active'],
    default: 'Pending' // Stays pending until they claim the account and set a password
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);