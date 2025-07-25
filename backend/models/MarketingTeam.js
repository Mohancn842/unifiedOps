const mongoose = require('mongoose');

const marketingTeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MarketingEmployee',
    },
  ],
  teamLead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MarketingEmployee',
    required: true,
  },
  leads: [
    {
      type: String, // Client or lead names
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('MarketingTeam', marketingTeamSchema);
