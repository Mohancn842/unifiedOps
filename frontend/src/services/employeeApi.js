// src/services/employeeApi.js
import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

export const employeeLogin = async (email, password) => {
  const response = await API.post('/auth/login', {
    email,
    password,
    role: 'employee' // ✅ REQUIRED
  });

  return response.data; // Should return { token }
};
