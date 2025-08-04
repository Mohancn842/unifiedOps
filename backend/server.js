const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ✅ Define allowed origins first
const allowedOrigins = [
  'https://managenest-frontend.onrender.com',
  'http://localhost:3000'
];

app.use(cors({
  origin: ['http://localhost:3000', 'https://managenest-frontend.onrender.com'],
  credentials: true,
}));


// Continue with other middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
require('./models/SupportEmployee'); 
require('./models/Ticket');          
require('./models/AccountProject');

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
const campaignRoutes = require('./routes/campaignRoutes.js');
// ✅ New route: Marketing Employees
const marketingEmployeeRoutes = require('./routes/marketingEmployees');
const marketingTeamRoutes = require('./routes/marketingTeams');
const authRoutes1 = require('./routes/authRoute1');
const ticketRoutes = require('./routes/ticketRoutes');
const supportEmployeeRoutes = require('./routes/support-employees');
const teamRoutes = require('./routes/teamRoutes');
const salesEmployeeRoutes = require('./routes/salesemployeeRoutes');
const payrollLoginRoutes = require("./routes/payrollLoginRoutes");



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
app.use('/api/marketing-teams', marketingTeamRoutes);
app.use('/api/sales/employees', salesEmployeeRoutes);
app.use('/api/marketing-employees', marketingEmployeeRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api', authRoutes1);
app.use('/api/tickets', ticketRoutes);
app.use('/api/support-employees', supportEmployeeRoutes);
app.use('/api/payroll', payrollLoginRoutes);
app.use('/api/account-projects', require('./routes/accountProject'));
app.use('/api/invoices', require('./routes/invoice'));
app.use('/api/teams', teamRoutes); 

// ✅ Root test route
app.get('/', (req, res) => {
  res.send('✅ UnifiedOps API is running...');
});

// ✅ MongoDB connection and server start
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB (Compass/local)');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});