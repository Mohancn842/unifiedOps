const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SupportEmployee = require('../models/SupportEmployee');
const User = require('../models/User');

// ✅ Create a new support employee
router.post('/create', async (req, res) => {
  try {
    const { name, email, password, department, designation, salary } = req.body;

    const existing = await SupportEmployee.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: '⚠️ Employee already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Save in SupportEmployee collection
    const supportEmp = new SupportEmployee({
      name,
      email,
      passwordHash,
      department,
      designation,
      salary,
    });
    await supportEmp.save();

    // Save in User collection
    const user = new User({
      name,
      email,
      passwordHash,
      role: 'support',
    });
    await user.save();

    res.status(201).json({ message: '✅ Support employee created successfully' });
  } catch (err) {
    console.error('❌ Error creating employee:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ Get all support employees (excluding password)
router.get('/', async (req, res) => {
  try {
    const employees = await SupportEmployee.find().select('-passwordHash');
    res.json(employees);
  } catch (err) {
    console.error('❌ Fetch failed:', err);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});
// ✅ Login route for Support Employees and Support Managers
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Fetch user by email (no role filtering)
    const user = await User.findOne({ email });
    if (!user || (user.role !== 'support' && user.role !== 'sm')) {
      return res.status(401).json({ error: '❌ Not authorized: Invalid role or email' });
    }

    // Compare password (hash or plain)
    const isPasswordMatch = user.passwordHash === password || await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: '❌ Invalid password' });
    }

    let employee = null;

    if (user.role === 'support') {
      employee = await SupportEmployee.findOne({ email });
      if (!employee) {
        return res.status(404).json({ error: '❌ Support employee record not found' });
      }
    } else if (user.role === 'sm') {
      // You can create a SupportManager model if you have one; here we just return user as employee
      employee = user;
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'support_secret_key',
      { expiresIn: '1d' }
    );

    res.json({ token, user, employee });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ error: 'Login failed due to server error' });
  }
});


// ✅ GET a support employee by ID along with assigned tickets
router.get('/:id', async (req, res) => {
  try {
    const employeeId = req.params.id;

    const employee = await SupportEmployee.findById(employeeId).select('-passwordHash');
    if (!employee) {
      return res.status(404).json({ error: 'Support employee not found' });
    }

    const Ticket = require('../models/Ticket'); // ensure model is available
    const assignedTickets = await Ticket.find({ assignedTo: employeeId })
      .populate('raisedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ employee, assignedTickets });
  } catch (err) {
    console.error('❌ Error fetching employee:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
