// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['employee', 'manager', 'hr','memployee','mmanager','support','sm','salesemployee', 'salesmanager','payrollmanager',], required: true },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('User', userSchema);
