const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Import or define User model safely to avoid OverwriteModelError
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: [
      "employee",
      "manager",
      "hr",
      "memployee",
      "mmanager",
      "support",
      "sm",
      "salesemployee",
      "salesmanager",
      "payrollmanager"
    ],
    required: true
  },
  isActive: { type: Boolean, default: true }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

// 🔐 POST /api/payroll/login - Login route for payroll manager
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.passwordHash !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    if (user.role !== "payrollmanager") {
      return res.status(403).json({ message: "Unauthorized role" });
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
