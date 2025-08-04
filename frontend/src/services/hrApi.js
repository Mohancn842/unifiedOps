import axios from 'axios';
const baseURL = process.env.REACT_APP_API_BASE_URL;

export const hrLogin = async (email, password) => {
  const response = await axios.post(`${baseURL}/auth/login`, {
    email,
    password,
    role: 'hr'
  });
  return response.data;
};
