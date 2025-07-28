import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SupportEmployeeLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const handlePopState = () => {
      navigate('/', { replace: true });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);

  const handleLogin = async () => {
  setLoading(true);
  try {
    const res = await axios.post(`${baseURL}/api/support-employees/login`, {
      email,
      password,
    });

    const { token, user, employee } = res.data;

    if (!employee || !user) {
      alert('❌ Login failed: Invalid user or data');
      setLoading(false);
      return;
    }

    // Save shared data
    localStorage.setItem('supportEmployeeId', employee._id);
    localStorage.setItem('supportEmployeeData', JSON.stringify(employee));
    localStorage.setItem('supportEmployeeToken', token);

    // Role-based redirection
    if (user.role === 'support') {
      alert('✅ Login successful');
      navigate('/support/dashboard', { replace: true });
    } else if (user.role === 'sm') {
      alert('✅ Login successful');
      navigate('/suportmanagerdash', { replace: true }); // ✅ check route spelling
    } else {
      alert('❌ Unauthorized: Only support and support managers allowed');
    }
  } catch (error) {
    console.error(error);
    alert('❌ Invalid credentials or server error');
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={outerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>🛠️ Support Login</h2>

        <label style={labelStyle}>Email</label>
        <input
          type="email"
          autoComplete="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <label style={{ ...labelStyle, marginTop: '20px' }}>Password</label>
        <input
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={handleLogin}
          style={loading ? { ...loginButtonStyle, opacity: 0.6 } : loginButtonStyle}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

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

// Styles (same as before)
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

export default SupportEmployeeLogin;
