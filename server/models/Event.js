const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['Event', 'Task', 'Meeting'], 
    default: 'Task' 
  },
  visibility: { 
    type: String, 
    enum: ['Global', 'Personal'], 
    default: 'Personal' 
  },
  date: { 
    type: Date,
    required: true
  },
  completed: { 
    type: Boolean, 
    default: false // Used specifically for the Reminders checklist
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);