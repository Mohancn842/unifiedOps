import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', passwordHash: '', department: '',
    designation: '', salary: '', assignedTarget: '', joinDate: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = ['salary', 'assignedTarget'].includes(name) ? Number(value) : value;
    setFormData({ ...formData, [name]: updatedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        joinDate: new Date(formData.joinDate).toISOString()
      };
      await axios.post('http://localhost:5000/api/sales/employees/add', payload);
      alert('✅ Employee added successfully!');
      navigate('/salesmanager/dashboard/');
    } catch (err) {
      console.error('❌ Error adding employee:', err);
      alert('❌ Failed to add employee. Check console.');
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: 'auto' }}>
      <h2>Add New Employee</h2>
      <form onSubmit={handleSubmit}>
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} style={{ marginBottom: '16px' }}>
            <label style={{ fontWeight: 'bold' }}>
              {key === 'passwordHash' ? 'Password' :
                key === 'assignedTarget' ? 'Assigned Target' :
                key === 'joinDate' ? 'Join Date' :
                key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            <input
              type={key === 'joinDate' ? 'date' : (key === 'passwordHash' ? 'password' : 'text')}
              name={key}
              required
              value={value}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
        ))}
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: 'green', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '4px' }}>Add Employee</button>
      </form>
    </div>
  );
};

export default AddEmployee;
