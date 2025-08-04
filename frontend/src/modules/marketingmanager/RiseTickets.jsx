import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
const baseURL = process.env.REACT_APP_API_BASE_URL;
function RaiseTicket() {
  // Get employee ID and role from localStorage
  const rawId = localStorage.getItem('employeeId');
  const employeeId = rawId && rawId !== 'null' ? rawId : null;

  const roleRaw = localStorage.getItem('employeeRole');
  const role = roleRaw ? roleRaw.toLowerCase() : '';
  

  // Determine raisedByModel based on role
  let raisedByModel = 'MarketingEmployee'; // default fallback
  if (role === 'salesemployee' || role === 'sales') {
    raisedByModel = 'SalesEmployee';
  } else if (role === 'salesmanager') {
    raisedByModel = 'SalesManager';
  } else if (role === 'user') {
    raisedByModel = 'User';
  }

  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    raisedBy: employeeId,
    raisedByModel: raisedByModel,
  });

  const [tickets, setTickets] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const fetchMyTickets = useCallback(async () => {
    if (!employeeId) {
      console.warn('⚠️ No employee ID found in localStorage.');
      return;
    }

    try {
      // IMPORTANT: include raisedByModel param as backend expects both
      const res = await axios.get(`${baseURL}/api/tickets/user/${employeeId}/${raisedByModel}`);
      setTickets(res.data);
    } catch (err) {
      console.error('Error fetching ticket history:', err);
    }
  }, [employeeId, raisedByModel]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employeeId) {
      alert('❌ You are not logged in properly. Please log in again.');
      return;
    }

    try {
      await axios.post(`${baseURL}/api/tickets/raise`, form);
      alert('✅ Ticket Raised');
      setForm({
        title: '',
        description: '',
        priority: 'Medium',
        raisedBy: employeeId,
        raisedByModel: raisedByModel,
      });
      fetchMyTickets();
    } catch (err) {
      alert('❌ Failed to raise ticket');
      console.error(err);
    }
  };

  useEffect(() => {
    if (!employeeId) {
      alert('❌ You are not logged in. Please login again.');
      return;
    }
    fetchMyTickets();
  }, [employeeId, fetchMyTickets]);

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.heading}>🎫 Raise Support Ticket</h2>

        <label style={styles.label}>Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter ticket title"
          required
          style={styles.input}
        />

        <label style={styles.label}>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the issue"
          required
          style={{ ...styles.input, height: '100px' }}
        />

        <label style={styles.label}>Priority</label>
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="Low">🟢 Low</option>
          <option value="Medium">🟡 Medium</option>
          <option value="High">🔴 High</option>
        </select>

        <button type="submit" style={styles.button}>🚀 Submit Ticket</button>
      </form>

      <div style={styles.history}>
        <h3 style={{ marginBottom: '10px' }}>📜 My Ticket History</h3>
        {tickets.length === 0 ? (
          <p>No tickets raised yet.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Priority</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Assigned To</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td style={styles.td}>{ticket.title}</td>
                  <td style={styles.td}>{ticket.priority}</td>
                  <td style={styles.td}>{ticket.status}</td>
                  <td style={styles.td}>{ticket.assignedTo ? ticket.assignedTo.name : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    width: '100%',
    maxWidth: '500px',
    marginBottom: '40px',
  },
  heading: {
    marginBottom: '20px',
    textAlign: 'center',
    color: '#1f2937',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    marginTop: '16px',
    color: '#374151',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
  },
  button: {
    marginTop: '24px',
    width: '100%',
    padding: '12px',
    backgroundColor: '#2563eb',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '16px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  history: {
    width: '100%',
    maxWidth: '800px',
    background: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    borderBottom: '1px solid #e5e7eb',
    padding: '12px',
    backgroundColor: '#f3f4f6',
    fontWeight: '600',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #e5e7eb',
  },
};

export default RaiseTicket;
