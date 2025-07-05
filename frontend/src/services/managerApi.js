// src/services/managerApi.js

import axios from 'axios';

const API = axios.create({
baseURL: 'https://unifiedops-backend.onrender.com/api',

});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Manager login function
export const managerLogin = async (email, password) => {
  const response = await API.post('/auth/login', {
    email,
    password,
    role: 'manager',
  });
  return response.data;
};

export default API;
