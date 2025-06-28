const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  start_date: Date,
  end_date: Date,
  status: { type: String, enum: ['Planned', 'In Progress', 'Completed'], default: 'Planned' },
  assignedEmployees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }]
});

module.exports = mongoose.model('Project', projectSchema);
