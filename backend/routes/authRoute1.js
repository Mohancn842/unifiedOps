const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const MarketingEmployee = require('../models/MarketingEmployee');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Use .env in production

// ✅ Unified POST /api/login — memployee (bcrypt) & mmanager (plain)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const role = user.role;

    // 🔐 Check password
    let isMatch = false;
    if (role === 'mmanager') {
      // Plain password check
      isMatch = user.passwordHash === password;
    } else {
      // Bcrypt check for memployee
      isMatch = await bcrypt.compare(password, user.passwordHash);
    }

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    let employeeData = null;

    if (role === 'memployee') {
      const employee = await MarketingEmployee.findOne({ email }).populate('team', 'name');
      if (!employee) {
        return res.status(404).json({ message: 'MarketingEmployee record not found' });
      }

      employeeData = {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        department: employee.department,
        designation: employee.designation,
        salary: employee.salary,
        teamId: employee.team?._id || null,
        teamName: employee.team?.name || null,
      };
    } else if (role === 'mmanager') {
      employeeData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
    } else {
      return res.status(403).json({ message: 'Unauthorized role' });
    }

    return res.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
      employee: employeeData,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
});

// ✅ Middleware: Verify JWT Token
function verifyToken(req, res, next) {
  const bearer = req.headers.authorization;
  if (!bearer || !bearer.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = bearer.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
}

// ✅ GET /api/employee/me — for MarketingEmployee
router.get('/employee/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user || user.role !== 'memployee') {
      return res.status(403).json({ message: 'Forbidden: Only marketing employees allowed' });
    }

    const employee = await MarketingEmployee.findOne({ email: user.email }).populate('team', 'name');
    if (!employee) {
      return res.status(404).json({ message: 'MarketingEmployee record not found' });
    }

    res.json({
      _id: employee._id,
      name: employee.name,
      email: employee.email,
      teamId: employee.team?._id || null,
      teamName: employee.team?.name || null,
    });
  } catch (error) {
    console.error('Fetch user error:', error);
    return res.status(500).json({ message: 'Server error fetching employee data' });
  }
});

module.exports = router;