const Notification = require('../models/Notification');

// Get all notifications for a specific employee
const getNotificationsByEmployee = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.params.employeeId })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error('❌ Error fetching notifications:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// Mark a specific notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error('❌ Error marking notification as read:', err);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

// Mark all notifications as read for an employee
const markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.params.employeeId, isRead: false },
      { isRead: true }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error('❌ Error marking all notifications as read:', err);
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
};

module.exports = {
  getNotificationsByEmployee,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};
