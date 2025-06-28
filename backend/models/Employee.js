// models/Employee.js
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  salary: { type: Number, required: true },
  join_date: { type: Date, required: true },
  contract_expiry: { type: Date },
  contract_file: { type: String },

  // ⬇️ Convert to arrays
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Employee', employeeSchema);
