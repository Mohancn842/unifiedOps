import axios from 'axios';
const baseURL = process.env.REACT_APP_API_BASE_URL;


// Fetch all employees (basic + contract info)
export const fetchAllEmployeesWithProjects = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${baseURL}/api/employees/full-details`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// ✅ Fetch only employees who have tasks assigned
export const fetchEmployeesWithTasks = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${baseURL}/api/employees/with-tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};



export const fetchEmployeeById = (id) =>
  axios.get(`${baseURL}/api/employees/${id}`);

export const fetchSessionsByEmployee = (id) =>
  axios.get(`${baseURL}/api/sessions/${id}`);

export const fetchNotifications = (id) =>
  axios.get(`${baseURL}/api/notifications/employee/${id}`);

export const markNotificationAsRead = (notificationId) =>
  axios.patch(`${baseURL}/api/notifications/${notificationId}/markAsRead`);

export const markAllNotificationsAsRead = (employeeId) =>
  axios.patch(`${baseURL}/api/notifications/employee/${employeeId}/markAllAsRead`);

export const fetchTeamMembers = (employeeId) =>
  axios.get(`${baseURL}/api/employees/team/${employeeId}`);

export const fetchAttendance = (employeeId) =>
  axios.get(`${baseURL}/api/attendance/${employeeId}/monthly`);

export const fetchLeaveHistory = (employeeId) =>
  axios.get(`${baseURL}/api/leaves/${employeeId}/history`);

export const markAttendance = (employeeId) =>
  axios.post(`${baseURL}/api/attendance/mark`, { employeeId });

export const applyLeave = (employeeId, date, reason) =>
  axios.post(`${baseURL}/api/leaves/apply`, { employeeId, date, reason });

export const logoutEmployee = (employeeId) =>
  axios.post(`${baseURL}/api/auth/logout`, { employeeId });

export const fetchTaskHistory = (employeeId) =>
  axios.get(`${baseURL}/api/tasks/history/${employeeId}`);
