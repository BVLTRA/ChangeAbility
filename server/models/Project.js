const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  status: {
    type: String,
    enum: ['Planning', 'Active', 'Completed', 'On Hold'],
    default: 'Planning'
  },
  startDate: { 
    type: Date 
  },
  endDate: { 
    type: Date 
  },
  // Links to specific teams handling the project
  assignedTeams: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Team' 
  }],
  // Links to specific beneficiaries being supported by this project
  targetBeneficiaries: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Beneficiary' 
  }]
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);