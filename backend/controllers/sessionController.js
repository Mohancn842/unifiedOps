const Session = require('../models/Session');

// GET /api/sessions/ — All sessions with employee names (for manager)
const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate('employee', 'name')
      .sort({ loginTime: -1 });

    res.json(sessions);
  } catch (error) {
    console.error('Error fetching all sessions:', error);
    res.status(500).json({ message: 'Failed to fetch all session history.' });
  }
};

// GET /api/sessions/:employeeId — Sessions by employee ID (for employee dashboard)
const getSessionsByEmployeeId = async (req, res) => {
  try {
    const sessions = await Session.find({ employee: req.params.employeeId })
      .sort({ loginTime: -1 });

    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions by employee ID:', error);
    res.status(500).json({ message: 'Failed to fetch session history.' });
  }
};

module.exports = {
  getAllSessions,
  getSessionsByEmployeeId,
};
