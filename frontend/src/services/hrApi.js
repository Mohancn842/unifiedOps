import axios from 'axios';

export const hrLogin = async (email, password) => {
  const response = await axios.post('/api/auth/login', {
    email,
    password,
    role: 'hr'
  });
  return response.data;
};
