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
router.post('/send-otp', sendOtp);                    // Step 1: Send OTP to email
router.post('/verify-otp', verifyOtp);                // Step 2: Verify OTP
router.post('/reset-password/otp', resetPasswordWithOtp);  // Step 3: Reset password after OTP

module.exports = router;
