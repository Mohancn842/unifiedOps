import axios from 'axios';
const baseURL = process.env.REACT_APP_API_BASE_URL;


export const assignTask = async (taskData) => {
  return await axios.post(`${baseURL}/assign`, taskData); 
};

export const fetchTasks = async () => {
  const res = await axios.get(`${baseURL}/tasks`);
  return res.data;
};

export const updateTaskStatus = async (taskId, status) => {
  return await axios.patch(`${baseURL}/${taskId}/status`, { status });
};
