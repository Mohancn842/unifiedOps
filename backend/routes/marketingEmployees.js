const express = require('express');
const bcrypt = require('bcrypt');
const MarketingEmployee = require('../models/MarketingEmployee');
const User = require('../models/User');

const router = express.Router();

/**
 * @route   POST /api/marketing-employees
 * @desc    Add a new marketing employee
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, password, department, designation, salary } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const userExists = await User.findOne({ email });
    const empExists = await MarketingEmployee.findOne({ email });

    if (userExists || empExists) {
      return res.status(400).json({ message: 'Email already exists in system.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create MarketingEmployee entry
    const newEmployee = new MarketingEmployee({
      name,
      email,
      passwordHash,
      department,
      designation,
      salary,
    });
    await newEmployee.save();

    // Create User entry for login
    const newUser = new User({
      name,
      email,
      passwordHash,
      role: 'memployee', // 'memployee' for marketing employee
    });
    await newUser.save();

    res.status(201).json({ message: 'Employee added successfully.' });

  } catch (error) {
    console.error('Server error while adding employee:', error);

    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate email. Employee already exists.' });
    }

    res.status(500).json({ message: 'Internal server error.' });
  }
});

/**
 * @route   GET /api/marketing-employees
 * @desc    Fetch all marketing employees with team populated
 */
router.get('/', async (req, res) => {
  try {
    const employees = await MarketingEmployee.find().populate('team', 'name');
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
