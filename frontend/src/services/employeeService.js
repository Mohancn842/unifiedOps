import axios from 'axios';

const API_BASE = '/api';


// Fetch all employees (basic + contract info)
export const fetchAllEmployeesWithProjects = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${API_BASE}/employees/full-details`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// ✅ Fetch only employees who have tasks assigned
export const fetchEmployeesWithTasks = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${API_BASE}/employees/with-tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};


const BASE_URL = '/api';


export const fetchEmployeeById = (id) =>
  axios.get(`${BASE_URL}/employees/${id}`);

export const fetchSessionsByEmployee = (id) =>
  axios.get(`${BASE_URL}/sessions/${id}`);

export const fetchNotifications = (id) =>
  axios.get(`${BASE_URL}/notifications/employee/${id}`);

export const markNotificationAsRead = (notificationId) =>
  axios.patch(`${BASE_URL}/notifications/${notificationId}/markAsRead`);

export const markAllNotificationsAsRead = (employeeId) =>
  axios.patch(`${BASE_URL}/notifications/employee/${employeeId}/markAllAsRead`);

export const fetchTeamMembers = (employeeId) =>
  axios.get(`${BASE_URL}/employees/team/${employeeId}`);

export const fetchAttendance = (employeeId) =>
  axios.get(`${BASE_URL}/attendance/${employeeId}/monthly`);

export const fetchLeaveHistory = (employeeId) =>
  axios.get(`${BASE_URL}/leaves/${employeeId}/history`);

export const markAttendance = (employeeId) =>
  axios.post(`${BASE_URL}/attendance/mark`, { employeeId });

export const applyLeave = (employeeId, date, reason) =>
  axios.post(`${BASE_URL}/leaves/apply`, { employeeId, date, reason });

export const logoutEmployee = (employeeId) =>
  axios.post(`${BASE_URL}/auth/logout`, { employeeId });

export const fetchTaskHistory = (employeeId) =>
  axios.get(`${BASE_URL}/tasks/history/${employeeId}`);
