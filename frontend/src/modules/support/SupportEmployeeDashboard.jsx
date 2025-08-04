import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const baseURL = process.env.REACT_APP_API_BASE_URL;

const SupportEmployeeDashboard = () => {
  const [employee, setEmployee] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const employeeId = localStorage.getItem('supportEmployeeId');
  const token = localStorage.getItem('supportEmployeeToken');

  const fetchEmployeeData = useCallback(async () => {
    try {
      const res = await axios.get(`${baseURL}/support-employees/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployee(res.data.employee);
      setTickets(res.data.assignedTickets || []);
    } catch (err) {
      console.error('Error fetching employee data:', err);
    } finally {
      setLoading(false);
    }
  }, [employeeId, token]);

  useEffect(() => {
    fetchEmployeeData();
  }, [fetchEmployeeData]);

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await axios.put(`${baseURL}/tickets/status/${ticketId}`, {
        status: newStatus,
      });
      alert('✅ Status updated');
      fetchEmployeeData();
    } catch (err) {
      console.error('❌ Failed to update ticket status:', err);
      alert('❌ Failed to update ticket status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('supportEmployeeId');
    localStorage.removeItem('supportEmployeeToken');
    localStorage.removeItem('supportEmployeeData');
    navigate('/', { replace: true });
  };

  const openTickets = tickets.filter(t => t.status === 'Open' || t.status === 'In Progress');
  const historyTickets = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed');

  if (loading) return <p style={{ textAlign: 'center', marginTop: '100px' }}>Loading dashboard...</p>;

  return (
    <div style={outerContainer}>
      <div style={headerStyle}>
        <h2>🛠️ Welcome, {employee?.name || 'Employee'}</h2>
        <button onClick={handleLogout} style={logoutButton}>🚪 Logout</button>
      </div>

      <div style={profileBox}>
        <p><strong>Email:</strong> {employee?.email}</p>
        <p><strong>Department:</strong> {employee?.department}</p>
        <p><strong>Designation:</strong> {employee?.designation}</p>
        <p><strong>Salary:</strong> ₹{employee?.salary}</p>
      </div>

      <h3 style={sectionHeading}>📋 Assigned Tickets</h3>
      {openTickets.length > 0 ? (
        <table style={tableStyle}>
         <thead>
  <tr>
    <th>Title</th>
    <th>Description</th> {/* ✅ New */}
    <th>Priority</th>
    <th>Status</th>
    <th>Raised By</th>
    <th>Update Status</th>
  </tr>
</thead>

          <tbody>
  {openTickets.map(ticket => (
    <tr key={ticket._id}>
      <td>{ticket.title}</td>
      <td>{ticket.description || 'N/A'}</td> {/* ✅ New */}
      <td>{ticket.priority}</td>
      <td>{ticket.status}</td>
      <td>{ticket.raisedBy?.email || 'N/A'}</td>
      <td>
        <select
          value={ticket.status}
          onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
          style={selectStyle}
        >
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      ) : (
        <p style={emptyText}>No active tickets assigned.</p>
      )}

      <h3 style={sectionHeading}>🕓 Ticket History</h3>
      {historyTickets.length > 0 ? (
        <table style={tableStyle}>
         <thead>
  <tr>
    <th>Title</th>
    <th>Description</th> {/* ✅ New */}
    <th>Priority</th>
    <th>Status</th>
    <th>Raised By</th>
  </tr>
</thead>

          <tbody>
  {historyTickets.map(ticket => (
    <tr key={ticket._id}>
      <td>{ticket.title}</td>
      <td>{ticket.description || 'N/A'}</td> {/* ✅ New */}
      <td>{ticket.priority}</td>
      <td>{ticket.status}</td>
      <td>{ticket.raisedBy?.email || 'N/A'}</td>
    </tr>
  ))}
</tbody>

        </table>
      ) : (
        <p style={emptyText}>No past tickets found.</p>
      )}
    </div>
  );
};

// ✅ Styles
const outerContainer = {
  padding: '30px',
  maxWidth: '1100px',
  margin: 'auto',
  fontFamily: 'Arial, sans-serif',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const logoutButton = {
  background: '#f44336',
  color: '#fff',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const profileBox = {
  background: '#f3f4f6',
  padding: '20px',
  borderRadius: '10px',
  marginTop: '20px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  lineHeight: '1.8',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  background: '#fff',
  marginTop: '12px',
  borderRadius: '10px',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
};

const sectionHeading = {
  marginTop: '40px',
  marginBottom: '10px',
  color: '#333',
};

const selectStyle = {
  padding: '6px 10px',
  borderRadius: '6px',
  border: '1px solid #ccc',
};

const emptyText = {
  color: '#777',
  fontStyle: 'italic',
  marginTop: '10px',
};

export default SupportEmployeeDashboard;
