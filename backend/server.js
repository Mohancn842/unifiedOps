const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve static files
app.use('/uploads/contracts', express.static(path.join(__dirname, 'uploads/contracts')));

// ✅ Register models before routes
require('./models/Employee');
require('./models/Project');
require('./models/Task');
require('./models/Session');
require('./models/Attendance');
require('./models/Leave');
require('./models/SalaryPayment');
require('./models/Notification');

// ✅ Import routes
const jobRouter = require('./routes/jobRouter');
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const payrollRoutes = require('./routes/payrollRoutes');

// ✅ Mount routes
app.use('/api/jobs', jobRouter);
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/notifications', notificationRoutes);

// ✅ Root test route
app.get('/', (req, res) => {
  res.send('✅ UnifiedOps API is running...');
});

// ✅ MongoDB connection and server start
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(5000, () => {
      console.log('🚀 Server running on http://localhost:5000');
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
