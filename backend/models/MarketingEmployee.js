const mongoose = require('mongoose');

const marketingEmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  department: String,
  designation: String,
  salary: Number,
  target: [String],
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MarketingTeam',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('MarketingEmployee', marketingEmployeeSchema);