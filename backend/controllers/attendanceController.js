// controllers/attendanceController.js
const Attendance = require('../models/Attendance');

// 📌 Mark Present for Today
const markAttendance = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const date = new Date().toISOString().split('T')[0];

    const exists = await Attendance.findOne({ employee: employeeId, date });
    if (exists) {
      return res.status(400).json({ message: 'Attendance already marked for today.' });
    }

    await Attendance.create({ employee: employeeId, date, status: 'Present' });
    res.json({ message: 'Attendance marked as Present.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark attendance.', error: err.message });
  }
};

// 📌 Get Monthly Summary + Today's Status
const getMonthlySummary = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const currentMonth = new Date().toISOString().slice(0, 7); // 'YYYY-MM'

    const records = await Attendance.find({
      employee: employeeId,
      date: { $regex: `^${currentMonth}` },
    });

    const today = new Date().toISOString().split('T')[0];
    const todayMarked = records.some(r => r.date === today);

    res.json({
      presentDays: records.filter(r => r.status === 'Present').length,
      todayMarked,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch attendance.', error: err.message });
  }
};

// 📌 Check if Present on Specific Date
const checkSpecificDate = async (req, res) => {
  try {
    const { employeeId, date } = req.params;

    const record = await Attendance.findOne({ employee: employeeId, date, status: 'Present' });
    res.json({ alreadyPresent: !!record });
  } catch (err) {
    res.status(500).json({ message: 'Failed to check attendance.', error: err.message });
  }
};

// 📌 Get all records (optional filter by date)
const getAllAttendance = async (req, res) => {
  try {
    const { date } = req.query;
    let filter = {};
    if (date) filter.date = date;

    const attendance = await Attendance.find(filter).populate('employee', 'name email department');
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
};

module.exports = {
  markAttendance,
  getMonthlySummary,
  checkSpecificDate,
  getAllAttendance,
};
