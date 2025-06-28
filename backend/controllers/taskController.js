const Task = require('../models/Task');
const Employee = require('../models/Employee');
const Project = require('../models/Project');
const Notification = require('../models/Notification');

// GET /api/tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignee', 'name')
      .populate('project', 'name');
    res.json(tasks);
  } catch (err) {
    console.error('❌ Failed to fetch all tasks:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// GET /api/tasks/history/:employeeId
const getTaskHistoryForEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const tasks = await Task.find({ assignee: employeeId }).populate('project', 'name');

    const enrichedTasks = tasks.map(task => {
      const estimatedTimeInSeconds = (task.estimated_hours || 0) * 3600;
      const actualWorkedTimeInSeconds = task.totalWorkedTimeInSeconds || 0;
      const remainingTimeInSeconds = Math.max(0, estimatedTimeInSeconds - actualWorkedTimeInSeconds);

      return {
        ...task._doc,
        estimatedTimeInSeconds,
        actualWorkedTimeInSeconds,
        remainingTimeInSeconds,
      };
    });

    res.json(enrichedTasks);
  } catch (err) {
    console.error('❌ Failed to fetch task history:', err);
    res.status(500).json({ error: 'Failed to fetch task history' });
  }
};

// POST /api/tasks/assign
const assignTask = async (req, res) => {
  try {
    const {
      project,
      assignee,
      title,
      description,
      priority,
      deadline,
      estimated_hours
    } = req.body;

    const task = new Task({
      project,
      assignee,
      title,
      description,
      priority,
      deadline,
      estimated_hours,
      status: 'Assigned',
      workStartTime: null,
      totalWorkedTimeInSeconds: 0
    });

    await task.save();

    // Update employee
    await Employee.findByIdAndUpdate(assignee, {
      $addToSet: { tasks: task._id, projects: project }
    });

    // Update project
    await Project.findByIdAndUpdate(project, {
      $addToSet: { assignedEmployees: assignee }
    });

    // Create notification
    await Notification.create({
      recipient: assignee,
      message: `📋 New task assigned: "${title}"`,
      link: `/employee/tasks/${task._id}`
    });

    res.status(201).json({ message: 'Task assigned successfully', task });
  } catch (err) {
    console.error('❌ Error assigning task:', err);
    res.status(500).json({ error: 'Task assignment failed' });
  }
};

// PATCH /api/tasks/:id/status
const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (status === 'In Progress' && task.status !== 'In Progress') {
      task.workStartTime = new Date();
    }

    if (task.status === 'In Progress' && status !== 'In Progress') {
      if (task.workStartTime) {
        const now = new Date();
        const workedSeconds = Math.floor((now - task.workStartTime) / 1000);
        task.totalWorkedTimeInSeconds =
          (task.totalWorkedTimeInSeconds || 0) + workedSeconds;
        task.workStartTime = null;
      }
    }

    task.status = status;
    await task.save();

    res.json({ message: 'Task status updated successfully', task });
  } catch (err) {
    console.error('❌ Failed to update task status:', err);
    res.status(500).json({ message: 'Failed to update task status' });
  }
};

// GET /api/tasks/all/history
const getAllTaskHistory = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignee', 'name email')
      .populate('project', 'name');

    const enrichedTasks = tasks.map(task => {
      const estimatedTimeInSeconds = (task.estimated_hours || 0) * 3600;
      const actualWorkedTimeInSeconds = task.totalWorkedTimeInSeconds || 0;
      const remainingTimeInSeconds = Math.max(0, estimatedTimeInSeconds - actualWorkedTimeInSeconds);

      return {
        ...task._doc,
        estimatedTimeInSeconds,
        actualWorkedTimeInSeconds,
        remainingTimeInSeconds,
      };
    });

    res.json(enrichedTasks);
  } catch (err) {
    console.error('❌ Failed to fetch all task history:', err);
    res.status(500).json({ message: 'Failed to fetch all task history' });
  }
};

module.exports = {
  getAllTasks,
  getTaskHistoryForEmployee,
  assignTask,
  updateTaskStatus,
  getAllTaskHistory,
};
