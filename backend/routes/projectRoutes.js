const express = require('express');
const router = express.Router();
const {
  addProject,
  getAllProjects,
  addMemberToProject,
} = require('../controllers/projectController');

// Add new project
router.post('/', addProject);

// Get all projects
router.get('/', getAllProjects);

// Add employee to project
router.post('/:projectId/add-member', addMemberToProject);

module.exports = router;
