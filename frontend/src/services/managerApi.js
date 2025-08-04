// src/services/managerApi.js

import API from './api';
const baseURL = process.env.REACT_APP_API_BASE_URL;

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Manager login function
export const managerLogin = async (email, password) => {
  const response = await API.post(`${baseURL}/api/auth/login`, {
    email,
    password,
    role: 'manager',
  });
  return response.data;
};

export default API;
