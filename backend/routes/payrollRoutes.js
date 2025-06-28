const express = require('express');
const router = express.Router();
const {
  paySalaries,
  getPaidSalariesForMonth,
  getPayrollHistory,
} = require('../controllers/payrollController');

// Pay salary to multiple employees
router.post('/pay', paySalaries);

// Get paid salaries for a specific month
router.get('/paid/:month', getPaidSalariesForMonth);

// Get full payroll history
router.get('/history', getPayrollHistory);

module.exports = router;
