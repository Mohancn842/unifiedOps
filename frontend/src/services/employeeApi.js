// src/services/employeeApi.js
import axios from 'axios';

export const employeeLogin = async (email, password) => {
  const response = await axios.post('http://localhost:5000/api/auth/login', {
    email,
    password,
    role: 'employee' // ✅ REQUIRED
  });

  return response.data; // Should return { token }
};
