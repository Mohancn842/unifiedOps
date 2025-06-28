const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getMonthlySummary,
  checkSpecificDate,
  getAllAttendance,
} = require('../controllers/attendanceController');

// 📌 POST /api/attendance/mark
router.post('/mark', markAttendance);

// 📌 GET /api/attendance/:employeeId/monthly
router.get('/:employeeId/monthly', getMonthlySummary);

// 📌 GET /api/attendance/:employeeId/date/:date
router.get('/:employeeId/date/:date', checkSpecificDate);

// 📌 GET /api/attendance/all?date=YYYY-MM-DD
router.get('/all', getAllAttendance);

module.exports = router;
