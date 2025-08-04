const express = require('express');
const router = express.Router();
const SalesEmployee = require('../models/salesEmployee');
const SalesUser = require('../models/User');

console.log('✅ SalesEmployee routes loaded');

router.get('/', (req, res) => {
  res.send('Sales Employee API is active');
});
// GET all employees
router.get('/', async (req, res) => {
  try {
    const employees = await SalesEmployee.find();
    res.json(employees);
  } catch (err) {
    console.error('❌ Error fetching employees:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST add new employee
router.post('/add', async (req, res) => {
  try {
    const {
      name, email, passwordHash,
      department, designation,
      salary, joinDate, assignedTarget
    } = req.body;

    const employee = new SalesEmployee({
      name, email, passwordHash,
      department, designation,
      salary, joinDate,
      assignedTarget,
      completedTarget: 0
    });

    await employee.save();

    const user = new SalesUser({
      name, email, passwordHash,
      role: 'salesemployee',
      isActive: true
    });

    await user.save();

    res.status(200).json({ message: '✅ Employee and User added successfully' });
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});
// POST /login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await SalesUser.findOne({ email });

    if (!user) return res.status(401).json({ message: '❌ Invalid email' });
    if (user.passwordHash !== password) return res.status(401).json({ message: '❌ Wrong password' });

    // For salesmanager, skip employee lookup
    if (user.role === 'salesmanager') {
      return res.status(200).json({
        token: 'dummyToken',
        role: user.role,
        email: user.email,
        name: user.name,
        _id: user._id // return user ID directly
      });
    }

    // For salesemployee, lookup in SalesEmployee collection
    const employee = await SalesEmployee.findOne({ email });
    if (!employee) return res.status(404).json({ message: '❌ Employee data not found' });

    res.status(200).json({
      token: 'dummyToken',
      role: user.role,
      email: user.email,
      name: user.name,
      _id: employee._id
    });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT update completed target
router.put('/updateTarget/:email', async (req, res) => {
  try {
    const { completedTarget } = req.body;
    const employee = await SalesEmployee.findOneAndUpdate(
      { email: req.params.email },
      { completedTarget },
      { new: true }
    );
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.status(200).json(employee);
  } catch (err) {
    console.error('❌ Update target error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET employee by email
router.get('/getByEmail/:email', async (req, res) => {
  try {
    const employee = await SalesEmployee.findOne({ email: req.params.email });
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.status(200).json(employee);
  } catch (err) {
    console.error('❌ Fetch by email error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
