import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SalesEmployeeLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handlePopState = () => {
      navigate('/', { replace: true });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);

 const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res = await axios.post('http://localhost:5000/api/sales/employees/login', {
      email,
      password,
    });

    // Save common info
    localStorage.setItem('employeeId', res.data._id);
    localStorage.setItem('employeeEmail', res.data.email);
    localStorage.setItem('employeeName', res.data.name);

    // Set employee role (custom for ticket system)
    if (res.data.role === 'salesmanager') {
      localStorage.setItem('employeeRole', 'salesmanager');
    } else {
      localStorage.setItem('employeeRole', 'sales'); // 👈 Needed for ticket system
    }

    alert('✅ Login successful!');

    // Redirect based on role
    if (res.data.role === 'salesmanager') {
      navigate('/salesmanager/dashboard');
    } else {
      navigate('/salesemployee/dashboard');
    }
  } catch (err) {
    console.error('Login error:', err);
    alert(err.response?.data?.message || '❌ Login failed');
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={outerStyle}>
      <form onSubmit={handleLogin} style={cardStyle}>
        <h2 style={titleStyle}>📈 Sales Login</h2>

        <label style={labelStyle}>Email</label>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        <label style={{ ...labelStyle, marginTop: '20px' }}>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        <button
          type="submit"
          style={loading ? { ...loginButtonStyle, opacity: 0.6 } : loginButtonStyle}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <button type="button" onClick={() => navigate('/')} style={backButtonStyle}>
          ⬅ Back to Home
        </button>

        <p style={{ marginTop: '12px', fontSize: '13px' }}>
          <span
            style={{ color: '#007bff', cursor: 'pointer' }}
            onClick={() => navigate('/reset-password')}
          >
            🔐 Forgot Password?
          </span>
        </p>

        <p style={footerStyle}>© 2025 UnifiedOps. All rights reserved.</p>
      </form>
    </div>
  );
};

// Same styles...
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

export default SalesEmployeeLogin;
