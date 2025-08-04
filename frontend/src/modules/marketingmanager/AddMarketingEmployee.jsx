import React, { useState } from 'react';
import axios from 'axios';
const baseURL = process.env.REACT_APP_API_BASE_URL;
function AddMarketingEmployee() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    designation: '',
    salary: '',
  });
  

  const handleAddEmployee = async () => {
    const { name, email, password, department, designation, salary } = form;

    if (!name || !email || !password) {
      return alert('Name, Email and Password are required.');
    }

    try {
      await axios.post(`${baseURL}/marketing-employees`, {
        name,
        email,
        password,
        department,
        designation,
        salary: parseFloat(salary),
      });

      alert('Employee added successfully!');
      setForm({ name: '', email: '', password: '', department: '', designation: '', salary: '' });
    } catch (err) {
      console.error('Error adding employee', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Error adding employee');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>➕ Add Marketing Employee</h2>

      {['name', 'email', 'password', 'department', 'designation', 'salary'].map((field) => (
        <input
          key={field}
          type={field === 'email' ? 'email' : field === 'password' ? 'password' : field === 'salary' ? 'number' : 'text'}
          placeholder={`${field.charAt(0).toUpperCase() + field.slice(1)} ${['name', 'email', 'password'].includes(field) ? '*' : ''}`}
          value={form[field]}
          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          style={styles.input}
        />
      ))}

      <button style={styles.button} onClick={handleAddEmployee}>
        🚀 Add Employee
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '30px',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#f9fafb',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#1e293b',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '16px',
  },
  button: {
    width: '100%',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    padding: '12px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default AddMarketingEmployee;
