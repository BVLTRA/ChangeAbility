const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    enum: ['Beneficiary Data', 'Team Issue', 'Project Issue', 'General / Other'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Open', 'In Review', 'Resolved'], 
    default: 'Open' 
  },
  submittedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);