const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User'); // adjust path if needed

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const existing = await User.findOne({ email: 'manager@gmail.com' });
  if (existing) {
    console.log('⚠️ Manager already exists');
    return mongoose.disconnect();
  }

  const passwordHash = await bcrypt.hash('123456', 10);

  await User.create({
    name: 'Manager One',
    email: 'manager@gmail.com',
    passwordHash,
    role: 'manager',
  });

  console.log('✅ New manager created: manager@gmail.com / 123456');
  mongoose.disconnect();
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});
