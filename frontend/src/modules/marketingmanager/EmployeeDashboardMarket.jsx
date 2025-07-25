import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmployeeDashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();

  // Fetch campaigns
  const fetchCampaigns = async () => {
  try {
    const employeeId = localStorage.getItem('employeeId');
    const res = await axios.get(`http://localhost:5000/api/campaigns/team/${employeeId}`);
    setCampaigns(res.data);
  } catch (err) {
    console.error('Error fetching campaigns:', err);
  }
};


 useEffect(() => {
  const userData = localStorage.getItem('employeeData');
  const token = localStorage.getItem('employeeToken');
  

  if (!token || !userData) {
    alert('Please log in again.');
    return navigate('/employee-login');
  }

  setEmployee(JSON.parse(userData));
  fetchCampaigns();
}, [navigate]);


  const handleAddCampaign = () => {
    navigate('/create-campaign');
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN');
  };

  const handleLogout = () => {
    localStorage.removeItem('employeeToken');
    localStorage.removeItem('employeeData');
    navigate('/');
  };

  return (
    <div style={container}>
      <div style={sidebar}>
        <h3 style={sidebarTitle}>👩‍💼 {employee?.name || 'Employee'}</h3>
        <button style={navBtn}>🏠 Dashboard</button>
        <button style={navBtn} onClick={() => navigate('/create-campaign')}>📢 Campaigns</button>
        <button style={navBtn} onClick={() => navigate('/rise-tickets')}>Rise Tickets</button>
        <button style={navBtn} onClick={handleLogout}>🚪 Logout</button>
      </div>

      <div style={mainContent}>
        <h1 style={header}>Welcome, {employee?.name || 'Employee'}!</h1>
        <p>Here's your campaign summary.</p>

        {/* Overview */}
        <div style={overview}>
          <div style={card}><h3>Active Campaigns</h3><p>{campaigns.filter(c => c.status === 'Active').length}</p></div>
          <div style={card}><h3>Total Campaigns</h3><p>{campaigns.length}</p></div>
        </div>

        {/* Actions */}
        <div style={{ marginTop: '30px' }}>
          <button style={blueBtn} onClick={handleAddCampaign}>➕ Add Campaign</button>
        </div>

       {/* Campaign Table */}
<div style={{ marginTop: '30px' }}>
  <h2>Ongoing Campaigns</h2>
  <table style={table}>
  <thead>
    <tr>
      <th>Title</th>
      <th>Agenda</th>
      <th>Date</th>
      <th>Time</th>
      <th>Mode</th>
      <th>Location</th>
      <th>Expected</th>
      <th>Actual</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {campaigns.map((c, idx) => (
      <tr key={idx}>
        <td>{c.title}</td>
        <td>{c.agenda}</td>
        <td>{formatDate(c.date)}</td>
        <td>{c.time}</td>
        <td>{c.mode}</td>
        <td>{c.mode === 'offline' ? c.location : 'N/A'}</td>
        <td>{c.expectedPeople}</td>
        <td>{c.actualPeople ?? '-'}</td>
        <td>
          <button style={linkBtn} onClick={() => navigate(`/view-campaign`)}>
            Edit
          </button>
        </td>
      </tr>
    ))}
    {campaigns.length === 0 && (
      <tr>
        <td colSpan="9" style={{ textAlign: 'center' }}>No campaigns found.</td>
      </tr>
    )}
  </tbody>
</table>

</div>

      </div>
    </div>
  );
};

// Styles
const container = {
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#f8fafc',
  fontFamily: 'sans-serif',
};

const sidebar = {
  width: '220px',
  backgroundColor: '#fff',
  borderRight: '1px solid #e2e8f0',
  padding: '20px',
};

const sidebarTitle = {
  fontSize: '20px',
  marginBottom: '30px',
};

const navBtn = {
  display: 'block',
  width: '100%',
  background: 'none',
  border: 'none',
  padding: '10px 0',
  textAlign: 'left',
  fontSize: '16px',
  cursor: 'pointer',
  color: '#2d3748',
};

const mainContent = {
  flex: 1,
  padding: '40px',
};

const header = {
  fontSize: '28px',
  fontWeight: 'bold',
};

const overview = {
  display: 'flex',
  gap: '20px',
  marginTop: '20px',
};

const card = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  padding: '20px',
  flex: 1,
};

const blueBtn = {
  padding: '10px 20px',
  backgroundColor: '#3182ce',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
};

const table = {
  width: '100%',
  backgroundColor: '#fff',
  borderCollapse: 'collapse',
  marginTop: '20px',
  border: '1px solid #e2e8f0',
};

const linkBtn = {
  background: 'none',
  border: 'none',
  color: '#3182ce',
  cursor: 'pointer',
};



export default EmployeeDashboard;