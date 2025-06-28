const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }, // ✅ FIXED
  loginTime: { type: Date, default: Date.now },
  logoutTime: { type: Date, default: null },
});

module.exports = mongoose.model('Session', sessionSchema);
