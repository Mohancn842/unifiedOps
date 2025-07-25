const express = require('express');
const router = express.Router();
const AccountProject = require('../models/AccountProject');

router.post('/', async (req, res) => {
  try {
    const project = new AccountProject(req.body);
    const saved = await project.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const projects = await AccountProject.find();
  res.json(projects);
});

module.exports = router;
