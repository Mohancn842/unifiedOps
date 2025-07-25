const mongoose = require('mongoose');

const AccountProjectSchema = new mongoose.Schema({
  projectName: String,
  startDate: Date,
  endDate: Date,
  estimatedAmount: Number,
  spentAmount: Number,
  description: String,
});

module.exports = mongoose.model('AccountProject', AccountProjectSchema);
