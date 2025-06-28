const express = require('express');
const router = express.Router();

const {
  getAllTasks,
  getTaskHistoryForEmployee,
  assignTask,
  updateTaskStatus,
  getAllTaskHistory,
} = require('../controllers/taskController');

// Get all tasks
router.get('/', getAllTasks);

// Get task history for an employee
router.get('/history/:employeeId', getTaskHistoryForEmployee);

// Assign a task
router.post('/assign', assignTask);

// Update task status (track time)
router.patch('/:id/status', updateTaskStatus);

// Get complete task history for all employees
router.get('/all/history', getAllTaskHistory);

module.exports = router;
