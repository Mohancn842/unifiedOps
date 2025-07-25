// models/Campaign.js
const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: Date,
  time: String,
  mode: {
    type: String,
    enum: ['online', 'offline'],
    required: true,
  },
  location: String, // Optional for offline
  expectedPeople: Number,
  actualPeople: Number,
  agenda: {
    type: String,
    required: true,
  },
  assignedTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MarketingTeam',
    required: true,
  },
});

module.exports = mongoose.model('Campaign', campaignSchema);
