// src/services/employeeApi.js
import axios from 'axios';
const baseURL = process.env.REACT_APP_API_BASE_URL;

export const employeeLogin = async (email, password) => {
  const response = await axios.post(`${baseURL}/auth/login`, {
    email,
    password,
    role: 'employee' // ✅ REQUIRED
  });

  return response.data; // Should return { token }
};
