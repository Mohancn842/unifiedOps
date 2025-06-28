const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // ✅ fix path here if needed

const MONGO_URI = 'mongodb://localhost:27017/unifiedops';

const createHR = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const email = 'hr@unifiedops.com';

    const existingUser = await User.findOne({ email, role: 'hr' });
    if (existingUser) {
      console.log('❌ HR user already exists.');
      return mongoose.disconnect();
    }

    const passwordHash = await bcrypt.hash('123456', 10);

    const hr = new User({
      name: 'HR Admin',
      email,
      passwordHash,
      role: 'hr',
      isActive: true,
    });

    await hr.save();
    console.log('✅ HR user created with password 123456');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error:', err.message);
    mongoose.disconnect();
  }
};

createHR();
