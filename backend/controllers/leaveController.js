const Leave = require('../models/Leave');

// POST /api/leaves/apply
const applyLeave = async (req, res) => {
  try {
    const { employeeId, date, reason } = req.body;

    const exists = await Leave.findOne({ employee: employeeId, date });
    if (exists) return res.status(400).json({ message: 'Leave already applied for this date.' });

    await Leave.create({ employee: employeeId, date, reason });
    res.json({ message: 'Leave application submitted.' });
  } catch (err) {
    res.status(500).json({ message: 'Leave request failed', error: err.message });
  }
};

// GET /api/leaves/pending
const getPendingLeaves = async (req, res) => {
  try {
    const pendingLeaves = await Leave.find({ status: 'Pending' }).populate('employee', 'name email department');
    res.json(pendingLeaves);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch leave requests.' });
  }
};

// PUT /api/leaves/:id/approve or reject
const updateLeaveStatus = async (req, res) => {
  try {
    const { id, action } = req.params;
    if (!['approve', 'reject'].includes(action)) return res.status(400).json({ message: 'Invalid action.' });

    const leave = await Leave.findById(id);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });

    leave.status = action === 'approve' ? 'Approved' : 'Rejected';
    await leave.save();

    res.json({ message: `Leave ${action}d successfully.` });
  } catch (err) {
    res.status(500).json({ message: 'Error updating leave status', error: err.message });
  }
};

// GET /api/leaves/:employeeId/history
const getLeaveHistory = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const history = await Leave.find({ employee: employeeId }).sort({ date: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch leave history', error: err.message });
  }
};

// GET /api/leaves/all
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate('employee', 'name email department designation');
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load leaves', error: err.message });
  }
};

module.exports = {
  applyLeave,
  getPendingLeaves,
  updateLeaveStatus,
  getLeaveHistory,
  getAllLeaves,
};
