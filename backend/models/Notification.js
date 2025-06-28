const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true }, // ✅ Changed to 'Employee'
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  link: { type: String }, // optional: for UI routing (e.g. /tasks/123)
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
