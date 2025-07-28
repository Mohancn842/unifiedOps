const express = require('express');
const router = express.Router();
const {
  login,
  logout,
  getUserId,
  sendOtp,
  verifyOtp,
  resetPasswordWithOtp
} = require('../controllers/authController');

// 🔐 Authentication Routes
router.post('/login', login);
router.post('/logout', logout);
router.get('/user-id', getUserId);

// 🔁 OTP-based Password Reset Routes
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password/otp', resetPasswordWithOtp);

module.exports = router;
