const express = require('express');
const router = express.Router();
const SalesUser = require('../models/salesuser');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, passwordHash } = req.body;

  try {
    const user = await SalesUser.findOne({ email, passwordHash });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Token simulation (no JWT for now)
    const token = `mock-token-${user._id}`;

    res.status(200).json({
      token,
      role: user.role,
      message: '✅ Login successful'
    });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
