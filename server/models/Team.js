const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  lead: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' // Links to the User who manages the team
  },
  members: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' // Array of linked Users
  }]
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);