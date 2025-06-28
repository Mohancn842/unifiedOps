const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

// POST /api/employees
const addEmployee = async (req, res) => {
  try {
    const {
      name, email, password,
      department, designation,
      salary, join_date, contract_expiry,
    } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    const contractPath = req.file ? req.file.path : null;

    const employee = new Employee({
      name, email, passwordHash, department, designation,
      salary, join_date, contract_expiry, contract_file: contractPath,
      projects: [], tasks: []
    });
    await employee.save();

    const user = new User({ name, email, passwordHash, role: 'employee' });
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
    });

    const mailOptions = {
      from: '"UnifiedOps HR" <hr@unifiedops.com>',
      to: email,
      subject: 'Welcome to UnifiedOps – Your Joining Details & Offer Letter',
      html: `
        <p>Dear ${name},</p>
        <p>Welcome to <strong>UnifiedOps</strong>! You’ve been added to our system as a new employee.</p>
        <p><strong>🧾 Login Credentials:</strong><br/>
         <strong>Username (Email):</strong> ${email}<br/>
         <strong>Password:</strong> ${password}</p>
        <p>Please log in via <a href="http://localhost:3000/employee/login">Employee Login Portal</a></p>
        <p><strong>🗓 Joining Date:</strong> ${join_date}</p>
        <p>Warm regards,<br/>HR Executive – UnifiedOps</p>
      `,
      attachments: contractPath ? [{
        filename: 'UnifiedOps_OfferLetter.pdf',
        path: contractPath,
        contentType: 'application/pdf',
      }] : []
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: 'Employee added and email sent successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Server error while adding employee or sending email' });
  }
};

// GET /api/employees/full-details
const getAllEmployeesFullDetails = async (req, res) => {
  try {
    const employees = await Employee.find().select('-__v');
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch employees' });
  }
};

// GET /api/employees/with-tasks
const getEmployeesWithTasks = async (req, res) => {
  try {
    const employeesWithTasks = await Employee.find({ tasks: { $exists: true, $not: { $size: 0 } } })
      .populate({
        path: 'tasks',
        select: 'title deadline status project',
        populate: { path: 'project', select: 'name' }
      })
      .populate({ path: 'projects', select: 'name status' })
      .select('name email department designation projects tasks');
    res.json(employeesWithTasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load employees with tasks' });
  }
};

// GET /api/employees/:id
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).select('-__v');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const projects = await Project.find({ _id: { $in: employee.projects } })
      .select('name description status start_date end_date');

    const projectsWithTasks = await Promise.all(projects.map(async (project) => {
      const projectTasks = await Task.find({
        project: project._id, assignee: employee._id
      }).select('title description status deadline priority estimated_hours');
      return { ...project.toObject(), tasks: projectTasks };
    }));

    const individualTasks = await Task.find({
      _id: { $in: employee.tasks },
      $or: [{ project: null }, { project: { $exists: false } }]
    }).select('title description status deadline priority estimated_hours');

    res.json({
      ...employee.toObject(),
      projects: projectsWithTasks,
      individualTasks
    });

  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch employee' });
  }
};

// GET /api/employees/:id/performance
const getEmployeePerformance = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: 'Invalid employee ID' });

  try {
    const allTasks = await Task.find({ assignee: id });

    const completedTasks = allTasks.filter(t => t.status === 'Completed');
    const inProgressTasks = allTasks.filter(t => t.status === 'In Progress');
    const pendingTasks = allTasks.filter(t => t.status === 'Assigned');

    const onTimeCompleted = completedTasks.filter(t =>
      t.deadline && t.workStartTime && t.deadline >= t.workStartTime
    );

    const totalWorkedSeconds = completedTasks.reduce(
      (sum, t) => sum + (t.totalWorkedTimeInSeconds || 0), 0
    );

    const monthly = {};
    completedTasks.forEach(t => {
      const month = new Date(t.deadline).toLocaleString('default', { month: 'short' });
      monthly[month] = (monthly[month] || 0) + 1;
    });

    res.json({
      totalTasks: allTasks.length,
      completedTasks: completedTasks.length,
      inProgressTasks: inProgressTasks.length,
      pendingTasks: pendingTasks.length,
      taskCompletionRate: allTasks.length ? Math.round((completedTasks.length / allTasks.length) * 100) : 0,
      onTimeRate: completedTasks.length ? Math.round((onTimeCompleted.length / completedTasks.length) * 100) : 0,
      totalHoursWorked: Math.round(totalWorkedSeconds / 3600),
      monthly,
    });

  } catch (err) {
    res.status(500).json({ message: 'Failed to compute performance' });
  }
};

// GET /api/employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().select('-passwordHash -__v');
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch employees' });
  }
};

// GET /api/employees/team/:employeeId
const getEmployeeTeam = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const employee = await Employee.findById(employeeId).populate('projects');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const projectIds = employee.projects.map(p => p._id);

    const teamMembers = await Employee.find({
      _id: { $ne: employeeId },
      projects: { $in: projectIds }
    }).populate('projects', 'name').select('name email designation projects');

    const enriched = await Promise.all(teamMembers.map(async (member) => {
      const tasks = await Task.find({ assignee: member._id }).populate('project', 'name');
      return {
        _id: member._id,
        name: member.name,
        email: member.email,
        designation: member.designation,
        projects: member.projects,
        tasks: tasks.map(t => ({
          _id: t._id,
          title: t.title,
          status: t.status,
          deadline: t.deadline,
          projectName: t.project?.name || 'Unassigned'
        }))
      };
    }));

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: 'Server error while fetching team data' });
  }
};

module.exports = {
  addEmployee,
  getAllEmployeesFullDetails,
  getEmployeesWithTasks,
  getEmployeeById,
  getEmployeePerformance,
  getAllEmployees,
  getEmployeeTeam,
};
