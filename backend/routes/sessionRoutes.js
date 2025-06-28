const express = require('express');
const router = express.Router();
const {
  getAllSessions,
  getSessionsByEmployeeId,
} = require('../controllers/sessionController');

// All sessions (for managers)
router.get('/', getAllSessions);

// Sessions for a specific employee
router.get('/:employeeId', getSessionsByEmployeeId);

module.exports = router;
