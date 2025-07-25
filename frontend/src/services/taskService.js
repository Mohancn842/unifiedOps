import axios from 'axios';
const API = '/api/tasks';


export const assignTask = async (taskData) => {
  return await axios.post(`${API}/assign`, taskData); // ✅ Fix here
};

export const fetchTasks = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const updateTaskStatus = async (taskId, status) => {
  return await axios.patch(`${API}/${taskId}/status`, { status });
};
