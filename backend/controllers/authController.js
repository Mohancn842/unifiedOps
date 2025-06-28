const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');
const Session = require('../models/Session');
const OtpToken = require('../models/OtpToken');
const { sendOtpEmail } = require('../services/authEmailService');

// 🔐 POST /api/auth/login
const login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email, role, isActive: true });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    let userId = user._id;

    if (role === 'employee') {
      const employee = await Employee.findOne({ email });
      if (!employee) return res.status(404).json({ message: 'Employee record not found' });

      userId = employee._id;

      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const existingSession = await Session.findOne({
        employee: userId,
        loginTime: { $gte: startOfToday },
        logoutTime: null,
      });

      if (!existingSession) {
        await Session.create({
          employee: userId,
          loginTime: new Date(),
        });
      }
    }

    const token = jwt.sign(
      { userId, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// 🔐 POST /api/auth/logout
const logout = async (req, res) => {
  const { employeeId } = req.body;

  try {
    const session = await Session.findOne({
      employee: employeeId,
      $or: [{ logoutTime: null }, { logoutTime: { $exists: false } }]
    }).sort({ loginTime: -1 });

    if (session) {
      session.logoutTime = new Date();
      await session.save();
    }

    res.json({ message: 'Logout recorded successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Logout failed' });
  }
};

// 🆔 GET /api/auth/user-id?email=someone@example.com
const getUserId = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.query.email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ userId: user._id });
  } catch (err) {
    console.error('Error fetching user ID:', err);
    res.status(500).json({ message: 'Failed to fetch user ID' });
  }
};

// 📧 POST /api/auth/send-otp
const sendOtp = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  await OtpToken.findOneAndUpdate(
    { email },
    { otp, expiresAt },
    { upsert: true, new: true }
  );

  await sendOtpEmail(email, otp);
  res.json({ message: 'OTP sent to your email' });
};

// ✅ POST /api/auth/verify-otp
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const record = await OtpToken.findOne({ email });
  if (!record || record.expiresAt < new Date() || record.otp !== otp)
    return res.status(400).json({ message: 'Invalid or expired OTP' });

  res.json({ message: 'OTP verified' });
};

// 🔁 POST /api/auth/reset-password/otp
const resetPasswordWithOtp = async (req, res) => {
  const { email, otp, password } = req.body;

  const record = await OtpToken.findOne({ email });
  if (!record || record.otp !== otp || record.expiresAt < new Date()) {
    return res.status(400).json({ message: 'OTP verification failed' });
  }

  const user = await User.findOne({ email });
  const passwordHash = await bcrypt.hash(password, 10);
  user.passwordHash = passwordHash;
  await user.save();

  await OtpToken.deleteOne({ email });

  res.json({ message: 'Password reset successfully' });
};

module.exports = {
  login,
  logout,
  getUserId,
  sendOtp,
  verifyOtp,
  resetPasswordWithOtp
};
