const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true,
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Leave'],
    default: 'Present',
  },
});

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true }); // Ensure no duplicate entry per day

module.exports = mongoose.model('Attendance', attendanceSchema);
