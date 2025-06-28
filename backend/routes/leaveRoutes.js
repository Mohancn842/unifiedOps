const express = require('express');
const router = express.Router();
const {
  applyLeave,
  getPendingLeaves,
  updateLeaveStatus,
  getLeaveHistory,
  getAllLeaves,
} = require('../controllers/leaveController');

// Apply for leave
router.post('/apply', applyLeave);

// Get all pending leaves
router.get('/pending', getPendingLeaves);

// Approve or reject leave
router.put('/:id/:action', updateLeaveStatus);

// Get leave history of specific employee
router.get('/:employeeId/history', getLeaveHistory);

// Get all leave records
router.get('/all', getAllLeaves);

module.exports = router;
