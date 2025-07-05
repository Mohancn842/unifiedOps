// src/services/projectService.js
import axios from 'axios';

const API_BASE = 'https://unifiedops-backend.onrender.com/api';


export const addProject = async (projectData) => {
  const token = localStorage.getItem('token');
  return await axios.post(`${API_BASE}/projects`, projectData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
