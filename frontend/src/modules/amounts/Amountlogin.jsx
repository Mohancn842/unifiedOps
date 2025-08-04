import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const baseURL = process.env.REACT_APP_API_BASE_URL;
const PayrollManagerLogin = () => {
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
      const res = await axios.post(`${baseURL}/api/payroll/login`, {
        email,
        password,
      });

      const { user, token } = res.data;

      // Save info to localStorage
      localStorage.setItem('payrollToken', token);
      localStorage.setItem('payrollManagerId', user.id);
      localStorage.setItem('payrollManagerName', user.name);
      localStorage.setItem('payrollManagerEmail', user.email);
      localStorage.setItem('payrollManagerRole', user.role);

      alert('✅ Payroll Manager login successful');
      navigate('/amountdashboard', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      alert(err.response?.data?.message || '❌ Login failed');
    }
  };

  return (
    <div style={outerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>💼 Payroll Manager Login</h2>

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

        <p style={footerStyle}>© 2025 UnifiedOps. All rights reserved.</p>
      </div>
    </div>
  );
};

// Reuse styles
const outerStyle = {
  minHeight: '100vh',
  backgroundColor: '#f5f9ff',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const cardStyle = {
  background: '#ffffff',
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

export default PayrollManagerLogin;
