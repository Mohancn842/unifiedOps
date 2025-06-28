import React, { useState } from 'react';
import { sendOtp } from '../../services/authApi';
import { useNavigate } from 'react-router-dom';

export default function ResetStep1Email() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      await sendOtp(email);
      alert('✅ OTP sent to your email');
      navigate('/verify-otp', { state: { email } });
    } catch {
      alert('❌ Failed to send OTP');
    }
  };

  return (
    <div style={outerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>🔐 Reset Password</h2>

        <label style={labelStyle}>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <button onClick={handleSendOtp} style={buttonStyle}>Send OTP</button>

        <p style={footerStyle}>You'll receive a 6-digit OTP on your registered email.</p>
      </div>
    </div>
  );
}

// 💅 Inline styles
const outerStyle = {
  minHeight: '100vh',
  backgroundColor: '#eef2f7',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const cardStyle = {
  background: '#fff',
  padding: '40px',
  borderRadius: '16px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  width: '360px',
  textAlign: 'center',
};

const titleStyle = {
  marginBottom: '24px',
  fontSize: '22px',
  color: '#333',
};

const labelStyle = {
  display: 'block',
  textAlign: 'left',
  marginBottom: '8px',
  fontWeight: 'bold',
  color: '#555',
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  fontSize: '14px',
  marginBottom: '20px',
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  background: 'linear-gradient(90deg, #007bff, #00c6ff)',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  fontSize: '15px',
  cursor: 'pointer',
};

const footerStyle = {
  marginTop: '20px',
  fontSize: '13px',
  color: '#777',
};
