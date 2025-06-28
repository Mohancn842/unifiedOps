import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeLogin } from '../../services/employeeApi';

const EmployeeLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handlePopState = () => {
      navigate('/', { replace: true });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const { token } = await employeeLogin(email, password);
      localStorage.setItem('employeeToken', token);
      alert('✅ Employee login successful');
      navigate('/employee/dashboard', { replace: true });
    } catch (err) {
      alert('❌ Invalid employee credentials');
    }
  };

  return (
    <div style={outerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>👤 Employee Login</h2>

        <label style={labelStyle}>Email</label>
        <input
          type="email"
          name="email"
          autoComplete="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <label style={{ ...labelStyle, marginTop: '20px' }}>Password</label>
        <input
          type="password"
          name="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button onClick={handleLogin} style={loginButtonStyle}>Login</button>
        <button onClick={() => navigate('/')} style={backButtonStyle}>⬅ Back to Home</button>
<p style={{ marginTop: '12px', fontSize: '13px' }}>
  <span
    style={{ color: '#007bff', cursor: 'pointer' }}
    onClick={() => navigate('/reset-password')}
  >
    🔐 Forgot Password?
  </span>
</p>

        <p style={footerStyle}>© 2025 UnifiedOps. All rights reserved.</p>
      </div>
    </div>
  );
};

// Reuse styles
const outerStyle = {
  minHeight: '100vh',
  backgroundColor: '#e8f0fe',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const cardStyle = {
  background: '#fefeff',
  padding: '40px',
  borderRadius: '20px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  width: '380px',
  textAlign: 'center',
};

const titleStyle = {
  marginBottom: '30px',
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#333',
};

const labelStyle = {
  display: 'block',
  textAlign: 'left',
  fontWeight: '600',
  marginBottom: '8px',
  fontSize: '14px',
  color: '#333',
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '12px',
  border: '1px solid #ddd',
  fontSize: '14px',
  boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.05)',
};

const loginButtonStyle = {
  marginTop: '30px',
  width: '100%',
  padding: '14px',
  border: 'none',
  borderRadius: '20px',
  background: 'linear-gradient(to right, #6a11cb, #2575fc)',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '16px',
  cursor: 'pointer',
};

const backButtonStyle = {
  marginTop: '12px',
  width: '100%',
  padding: '12px',
  background: '#cce5ff',
  border: 'none',
  borderRadius: '12px',
  fontSize: '14px',
  color: '#004085',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const footerStyle = {
  fontSize: '12px',
  color: '#aaa',
  marginTop: '25px',
};

export default EmployeeLogin;
