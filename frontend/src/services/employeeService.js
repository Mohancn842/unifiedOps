import axios from 'axios';
const baseURL = process.env.REACT_APP_API_BASE_URL;


// Fetch all employees (basic + contract info)
export const fetchAllEmployeesWithProjects = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${baseURL}/employees/full-details`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// ✅ Fetch only employees who have tasks assigned
export const fetchEmployeesWithTasks = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${baseURL}/employees/with-tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};



export const fetchEmployeeById = (id) =>
  axios.get(`${baseURL}/employees/${id}`);

export const fetchSessionsByEmployee = (id) =>
  axios.get(`${baseURL}/sessions/${id}`);

export const fetchNotifications = (id) =>
  axios.get(`${baseURL}/notifications/employee/${id}`);

export const markNotificationAsRead = (notificationId) =>
  axios.patch(`${baseURL}/notifications/${notificationId}/markAsRead`);

export const markAllNotificationsAsRead = (employeeId) =>
  axios.patch(`${baseURL}/notifications/employee/${employeeId}/markAllAsRead`);

export const fetchTeamMembers = (employeeId) =>
  axios.get(`${baseURL}/employees/team/${employeeId}`);

export const fetchAttendance = (employeeId) =>
  axios.get(`${baseURL}/attendance/${employeeId}/monthly`);

export const fetchLeaveHistory = (employeeId) =>
  axios.get(`${baseURL}/leaves/${employeeId}/history`);

export const markAttendance = (employeeId) =>
  axios.post(`${baseURL}/attendance/mark`, { employeeId });

export const applyLeave = (employeeId, date, reason) =>
  axios.post(`${baseURL}/leaves/apply`, { employeeId, date, reason });

export const logoutEmployee = (employeeId) =>
  axios.post(`${baseURL}/auth/logout`, { employeeId });

export const fetchTaskHistory = (employeeId) =>
  axios.get(`${baseURL}/tasks/history/${employeeId}`);
