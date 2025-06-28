const express = require('express');
const router = express.Router();
const { addJob, getJobs } = require('../controllers/jobController');

// Add a new job
router.post('/add', addJob);

// Get all jobs
router.get('/', getJobs);

module.exports = router;
