// src/services/projectService.js
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL;

export const addProject = async (projectData) => {
  const token = localStorage.getItem('token');
  return await axios.post(`${baseURL}/projects`, projectData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
