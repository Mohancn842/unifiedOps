import React, { useState } from 'react';
import { resetPasswordWithOtp } from '../../services/authApi';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ResetStep3NewPassword() {
  const { state } = useLocation();
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleReset = async () => {
    try {
      await resetPasswordWithOtp(state.email, state.otp, password);
      alert('✅ Password reset successfully');
      navigate('/employee/login');
    } catch {
      alert('❌ Reset failed. Please try again.');
    }
  };

  return (
    <div style={outerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>🔒 Set New Password</h2>

        <label style={labelStyle}>Enter your new password</label>
        <input
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button onClick={handleReset} style={buttonStyle}>Reset Password</button>

        <p style={footerStyle}>After resetting, you’ll be redirected to login.</p>
      </div>
    </div>
  );
}

// 💅 Styles
const outerStyle = {
  minHeight: '100vh',
  backgroundColor: '#f4f7fa',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const cardStyle = {
  background: '#fff',
  padding: '36px',
  borderRadius: '16px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
  width: '360px',
  textAlign: 'center',
};

const titleStyle = {
  fontSize: '22px',
  fontWeight: 'bold',
  marginBottom: '24px',
  color: '#2d3748',
};

const labelStyle = {
  textAlign: 'left',
  display: 'block',
  marginBottom: '8px',
  fontSize: '14px',
  fontWeight: '600',
  color: '#4a5568',
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  fontSize: '15px',
  marginBottom: '20px',
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  background: 'linear-gradient(to right, #ff416c, #ff4b2b)',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '15px',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
};

const footerStyle = {
  fontSize: '13px',
  marginTop: '20px',
  color: '#718096',
};
