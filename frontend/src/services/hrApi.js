import axios from 'axios';

export const hrLogin = async (email, password) => {
  const response = await axios.post('http://localhost:5000/api/auth/login', {
    email,
    password,
    role: 'hr'
  });
  return response.data;
};
