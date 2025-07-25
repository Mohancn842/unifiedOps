import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f5f9fc'
    }}>
      <div style={{
        background: '#fff',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        textAlign: 'center',
        width: '350px'
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
          Manage<span style={{ color: '#007bff' }}>Nest</span>
        </h1>
        <p style={{ color: '#555', marginBottom: '30px' }}>
          Streamlined Project & HR Management
        </p>

        <button
          onClick={() => navigate('/employee/login')}
          style={buttonStyle}
        >
          Employee Login
        </button>

        <button
          onClick={() => navigate('/manager/login')}
          style={buttonStyle}
        >
          Manager Login
        </button>

        <button
          onClick={() => navigate('/hr/login')}
          style={buttonStyle}
        >
          HR Login
        </button>

        
         <button
          onClick={() => navigate('marketempLogin')}
          style={buttonStyle}
        >
          Marketing Team Login
        </button>

      

 <button
          onClick={() => navigate('/suportemployeelogin')}
          style={buttonStyle}
        >
          Support Team Login
        </button>

         <button
          onClick={() => navigate('/salesemployee/login')}
          style={buttonStyle}
        >
          Sales Team Login
        </button>
        <button
          onClick={() => navigate('/amount/login')}
          style={buttonStyle}
        >
          Account Team Login
        </button>

      </div>
    </div>
  );
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  marginBottom: '15px',
  backgroundColor: '#2196f3',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

export default HomePage;
