const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  deadline: Date,
  estimated_hours: Number,
  status: {
    type: String,
    enum: ['Assigned', 'In Progress', 'Completed'],
    default: 'Assigned',
  },

  // ⬇️ New fields for tracking time
  workStartTime: { type: Date, default: null }, // When task moves to In Progress
  totalWorkedTimeInSeconds: { type: Number, default: 0 }, // Accumulates all durations
});

module.exports = mongoose.model('Task', taskSchema);
