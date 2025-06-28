const express = require('express');
const router = express.Router();
const multer = require('multer');

// Import controller functions
const {
  addEmployee,
  getAllEmployeesFullDetails,
  getEmployeesWithTasks,
  getEmployeeById,
  getEmployeePerformance,
  getAllEmployees,
  getEmployeeTeam,
} = require('../controllers/employeeController');

// === File Upload Config ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/contracts'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// === ROUTES ===

// Add new employee with contract upload
router.post('/', upload.single('contract_file'), addEmployee);

// Get all employee details
router.get('/full-details', getAllEmployeesFullDetails);

// Get employees who have tasks assigned
router.get('/with-tasks', getEmployeesWithTasks);

// Get team of a specific employee
router.get('/team/:employeeId', getEmployeeTeam);

// Get performance data of employee
router.get('/:id/performance', getEmployeePerformance);

// Get individual employee by ID
router.get('/:id', getEmployeeById);

// Get all employees (basic list)
router.get('/', getAllEmployees);

module.exports = router;
