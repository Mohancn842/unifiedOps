import axios from 'axios';
const baseURL = process.env.REACT_APP_API_BASE_URL;

export const sendOtp = async (email) => {
  const res = await axios.post(`${baseURL}/api/auth/send-otp`, { email });
  return res.data;
};

export const verifyOtp = async (email, otp) => {
  const res = await axios.post(`${baseURL}/api/auth/verify-otp`, { email, otp });
  return res.data;
};

export const resetPasswordWithOtp = async (email, otp, password) => {
  const res = await axios.post(`${baseURL}/api/auth/reset-password/otp`, { email, otp, password });
  return res.data;
};
