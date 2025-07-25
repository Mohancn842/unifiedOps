const mongoose = require('mongoose');

const supportEmployeeSchema = new mongoose.Schema({
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

  department: {
    type: String,
    default: '',
  },

  designation: {
    type: String,
    default: '',
  },

  salary: {
    type: Number,
    default: 0,
  },

  role: {
    type: String,
    default: 'support',
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  tickets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SupportEmployee', supportEmployeeSchema);
