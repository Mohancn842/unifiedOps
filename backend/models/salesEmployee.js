const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  passwordHash: String,
  department: String,
  designation: String,
  salary: Number,
  joinDate: Date,
  assignedTarget: Number,
  completedTarget: Number,
});

module.exports = mongoose.model('SalesEmployee', employeeSchema);
