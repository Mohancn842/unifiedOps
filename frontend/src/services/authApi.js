import axios from 'axios';

export const sendOtp = async (email) => {
  const res = await axios.post('/api/auth/send-otp', { email });
  return res.data;
};

export const verifyOtp = async (email, otp) => {
  const res = await axios.post('/api/auth/verify-otp', { email, otp });
  return res.data;
};

export const resetPasswordWithOtp = async (email, otp, password) => {
  const res = await axios.post('/api/auth/reset-password/otp', { email, otp, password });
  return res.data;
};
