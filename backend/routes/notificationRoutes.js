const express = require('express');
const router = express.Router();
const {
  getNotificationsByEmployee,
  markNotificationAsRead,
  markAllNotificationsAsRead
} = require('../controllers/notificationController');

// GET /api/notifications/employee/:employeeId
router.get('/employee/:employeeId', getNotificationsByEmployee);

// PATCH /api/notifications/:id/markAsRead
router.patch('/:id/markAsRead', markNotificationAsRead);

// PATCH /api/notifications/employee/:employeeId/markAllAsRead
router.patch('/employee/:employeeId/markAllAsRead', markAllNotificationsAsRead);

module.exports = router;
