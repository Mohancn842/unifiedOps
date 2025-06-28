import React, { useState } from 'react';
import { verifyOtp } from '../../services/authApi';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ResetStep2VerifyOtp() {
  const { state } = useLocation();
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      await verifyOtp(state.email, otp);
      alert('✅ OTP verified');
      navigate('/set-new-password', { state: { email: state.email, otp } });
    } catch {
      alert('❌ Invalid or expired OTP');
    }
  };

  return (
    <div style={outerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>🔑 Verify OTP</h2>

        <label style={labelStyle}>Enter the 6-digit OTP</label>
        <input
          type="text"
          placeholder="e.g. 123456"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          style={inputStyle}
        />

        <button onClick={handleVerify} style={buttonStyle}>Verify OTP</button>

        <p style={footerStyle}>Check your email for the OTP. It expires in 10 minutes.</p>
      </div>
    </div>
  );
}

// 💅 Inline styles
const outerStyle = {
  minHeight: '100vh',
  backgroundColor: '#f5f8fc',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const cardStyle = {
  background: '#fff',
  padding: '36px',
  borderRadius: '16px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  width: '360px',
  textAlign: 'center',
};

const titleStyle = {
  marginBottom: '20px',
  fontSize: '22px',
  fontWeight: 'bold',
  color: '#2d3748',
};

const labelStyle = {
  display: 'block',
  textAlign: 'left',
  marginBottom: '8px',
  fontWeight: '600',
  fontSize: '14px',
  color: '#4a5568',
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  fontSize: '16px',
  marginBottom: '20px',
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  background: 'linear-gradient(to right, #4e54c8, #8f94fb)',
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
  color: '#718096',
};
