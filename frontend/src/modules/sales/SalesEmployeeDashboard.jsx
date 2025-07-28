import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const baseURL = process.env.REACT_APP_API_BASE_URL;

const SalesEmployeeDashboard = () => {
  const [employee, setEmployee] = useState(null);
  const [showTarget, setShowTarget] = useState(false);
  const [newCompleted, setNewCompleted] = useState('');
  const navigate = useNavigate();

  const email = localStorage.getItem('employeeEmail');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/sales/employees/getByEmail/${email}`);
        setEmployee(res.data);
      } catch (err) {
        console.error('❌ Failed to load employee data', err);
      }
    };

    if (email) fetchData();
  }, [email]);

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`${baseURL}/api/sales/employees/updateTarget/${email}`, {
        completedTarget: Number(newCompleted),
      });
      setEmployee(res.data);
      alert('✅ Target updated!');
      setNewCompleted('');
    } catch (err) {
      alert('❌ Failed to update target');
    }
  };

  const progress = employee?.assignedTarget
    ? Math.min(Math.round((employee.completedTarget / employee.assignedTarget) * 100), 100)
    : 0;

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <span>👋 Welcome, {employee?.name}</span>
        <div>
          <button onClick={() => setShowTarget(!showTarget)} style={styles.btn}>🎯 My Target</button>
          <button onClick={() => navigate('/rise-tickets')} style={{ ...styles.btn, backgroundColor: '#6c63ff' }}>🎫 Raise Ticket</button>
          <button onClick={() => navigate('/')} style={{ ...styles.btn, backgroundColor: '#dc3545' }}>🚪 Logout</button>
        </div>
      </div>

      <div style={styles.progressCard}>
        <h3>📈 Progress Overview</h3>
        <p>Assigned Target: {employee?.assignedTarget}</p>
        <p>Completed Target: {employee?.completedTarget}</p>
        <div style={styles.progressWrap}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>
        <p>{progress}% completed</p>
      </div>

      {showTarget && (
        <div style={styles.targetCard}>
          <h3>🎯 My Target Table</h3>
          <table style={styles.table}>
            <thead>
              <tr><th>Assigned</th><th>Completed</th></tr>
            </thead>
            <tbody>
              <tr><td>{employee?.assignedTarget}</td><td>{employee?.completedTarget}</td></tr>
            </tbody>
          </table>
          <input
            type="number"
            placeholder="Update Completed Target"
            value={newCompleted}
            onChange={(e) => setNewCompleted(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleUpdate} style={styles.btnGreen}>✅ Save</button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    fontFamily: 'Arial',
    backgroundColor: '#f2f6fa',
    minHeight: '100vh',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  btn: {
    marginLeft: '10px',
    padding: '8px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  btnGreen: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  progressCard: {
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '30px',
  },
  progressWrap: {
    background: '#e9ecef',
    borderRadius: '10px',
    overflow: 'hidden',
    height: '24px',
    marginTop: '10px',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#28a745',
    transition: 'width 0.4s ease',
  },
  targetCard: {
    background: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '15px',
  },
  input: {
    padding: '10px',
    width: '100%',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
};

export default SalesEmployeeDashboard;
