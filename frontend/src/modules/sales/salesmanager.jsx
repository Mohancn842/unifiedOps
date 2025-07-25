import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SalesManager = () => {
  const navigate = useNavigate();
  const performanceRef = useRef();
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/sales/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const scrollToPerformance = () => {
    performanceRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const getPerformance = (emp) => {
    if (!emp.assignedTarget || emp.assignedTarget === 0) return 0;
    return Math.round((emp.completedTarget / emp.assignedTarget) * 100);
  };

  const avgPerformance = () => {
    if (employees.length === 0) return 0;
    const total = employees.reduce((acc, emp) => acc + getPerformance(emp), 0);
    return Math.round(total / employees.length);
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <div style={{
        width: '200px',
        background: '#f0f0f0',
        padding: '20px',
        height: '100vh',
        boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div>
          <h3 style={{ marginBottom: '20px' }}>Menu</h3>
          <button onClick={() => navigate('/add-employee')} style={btnStyle}>+ Add Employee</button>
          <button onClick={scrollToPerformance} style={{ ...btnStyle, backgroundColor: 'teal', marginTop: '15px' }}>📊 Sales Performance</button>
        </div>
        <button onClick={handleLogout} style={{ ...btnStyle, backgroundColor: '#dc3545', marginTop: '30px' }}>🚪 Logout</button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '40px', backgroundColor: '#f9f9f9' }}>
        <h2 style={{ fontWeight: 'bold', fontSize: '28px' }}>Employee Dashboard</h2>
        <p style={{ color: '#555', marginBottom: '20px' }}>Live employee data from MongoDB.</p>

        <table style={tableStyle}>
          <thead>
            <tr style={{ background: '#eee' }}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Department</th>
              <th style={thStyle}>Designation</th>
              <th style={thStyle}>Salary</th>
              <th style={thStyle}>Assigned Target</th>
              <th style={thStyle}>Completed Target</th>
              <th style={thStyle}>Join Date</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, idx) => (
              <tr key={idx}>
                <td style={tdStyle}>{emp.name}</td>
                <td style={tdStyle}>{emp.email}</td>
                <td style={tdStyle}>{emp.department}</td>
                <td style={tdStyle}>{emp.designation}</td>
                <td style={tdStyle}>{emp.salary}</td>
                <td style={tdStyle}>{emp.assignedTarget}</td>
                <td style={tdStyle}>{emp.completedTarget}</td>
                <td style={tdStyle}>{new Date(emp.joinDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div ref={performanceRef} style={{ marginTop: '60px' }}>
          <h3 style={{ fontSize: '24px', marginBottom: '20px' }}>📊 Sales Performance Overview</h3>
          <div style={{ marginBottom: '30px' }}>
            <strong>Average Team Performance:</strong>
            <div style={barWrapLarge}>
              <div style={{ ...barFill, width: `${avgPerformance()}%`, backgroundColor: getBarColor(avgPerformance()) }} />
              <span style={{ marginLeft: '10px' }}>{avgPerformance()}%</span>
            </div>
          </div>
          {employees.map((emp, idx) => (
            <div key={idx} style={{ marginBottom: '15px' }}>
              <strong>{emp.name}</strong>
              <div style={barWrapSmall}>
                <div
                  style={{
                    ...barFill,
                    width: `${getPerformance(emp)}%`,
                    backgroundColor: getBarColor(getPerformance(emp))
                  }}
                />
                <span style={{ marginLeft: '10px' }}>{getPerformance(emp)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const btnStyle = {
  width: '100%',
  padding: '10px',
  backgroundColor: 'orange',
  border: 'none',
  borderRadius: '6px',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const tableStyle = {
  width: '100%',
  background: 'white',
  borderCollapse: 'collapse',
  borderRadius: '10px',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  marginBottom: '60px'
};

const thStyle = {
  padding: '12px 15px',
  textAlign: 'left',
  fontWeight: 'bold',
  borderBottom: '1px solid #ddd'
};

const tdStyle = {
  padding: '12px 15px',
  borderBottom: '1px solid #ddd'
};

const barWrapLarge = {
  display: 'flex',
  alignItems: 'center',
  background: '#eee',
  borderRadius: '6px',
  overflow: 'hidden',
  height: '20px',
  width: '300px'
};

const barWrapSmall = {
  display: 'flex',
  alignItems: 'center',
  background: '#eee',
  borderRadius: '6px',
  overflow: 'hidden',
  height: '14px',
  width: '200px'
};

const barFill = {
  height: '100%',
  transition: 'width 0.3s ease'
};

const getBarColor = (value) => {
  if (value >= 80) return 'green';
  if (value >= 50) return 'orange';
  return 'red';
};

export default SalesManager;
