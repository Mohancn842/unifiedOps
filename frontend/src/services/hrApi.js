import axios from 'axios';

export const hrLogin = async (email, password) => {
  const response = await axios.post('https://unifiedops-backend.onrender.com/api/auth/login', {
    email,
    password,
    role: 'hr'
  });
  return response.data;
};
