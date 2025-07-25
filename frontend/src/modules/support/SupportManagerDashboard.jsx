import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SupportManagerDashboard() {
  const [activeTab, setActiveTab] = useState('tickets');
  const [tickets, setTickets] = useState([]);
  const [supportEmployees, setSupportEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === 'tickets' || activeTab === 'history') fetchTickets();
    if (activeTab === 'assign') fetchSupportEmployees();
  }, [activeTab]);

  const fetchTickets = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tickets');
      setTickets(res.data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    }
  };

  const fetchSupportEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/support-employees');
      setSupportEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const handleAssign = async (ticketId, employeeId) => {
  try {
    const response = await axios.put(`http://localhost:5000/api/tickets/assign/${ticketId}`, {
      assignedTo: employeeId,
    });

    if (!response.data || !response.data._id || !response.data.assignedTo) {
      throw new Error('Invalid response: ticket or assignedTo missing');
    }

    alert('✅ Ticket assigned');
    fetchTickets(); // refresh ticket list
  } catch (err) {
    console.error('❌ Assignment error:', err);
    alert('❌ Failed to assign ticket');
  }
};

  const handleLogout = () => {
    localStorage.removeItem('supportEmployeeId');
    localStorage.removeItem('supportEmployeeToken');
    localStorage.removeItem('supportEmployeeData');
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.heading}>🛠 Support Manager Dashboard</h2>
        <button style={styles.logoutButton} onClick={handleLogout}>🚪 Logout</button>
      </div>

      <div style={styles.navTabs}>
        <button onClick={() => setActiveTab('tickets')} style={tabStyle(activeTab === 'tickets')}>📋 View Tickets</button>
        <button onClick={() => setActiveTab('assign')} style={tabStyle(activeTab === 'assign')}>🎯 Assign Tickets</button>
        <button onClick={() => setActiveTab('history')} style={tabStyle(activeTab === 'history')}>🕓 Ticket History</button>
        <button onClick={() => setActiveTab('create')} style={tabStyle(activeTab === 'create')}>➕ Create Employee</button>
      </div>

      {activeTab === 'tickets' && <TicketTable tickets={tickets.filter(t => t.status === 'Open')} />}
    {activeTab === 'assign' && (
  <AssignTicketsTable
    tickets={tickets.filter(
      (t) => t.status === 'Open' || t.status === 'In Progress'
    )}
    supportEmployees={supportEmployees}
    handleAssign={handleAssign}
  />
)}

      {activeTab === 'history' && <TicketTable tickets={tickets.filter(t => t.status !== 'Open')} />}
      {activeTab === 'create' && <CreateEmployeeForm />}
    </div>
  );
}

function TicketTable({ tickets }) {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th>Title</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Raised By</th>
          <th>Assigned To</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map(ticket => (
          <tr key={ticket._id}>
            <td>{ticket.title}</td>
            <td>{ticket.priority}</td>
            <td>{ticket.status}</td>
            <td>{ticket.raisedBy?.email || '-'}</td>
            <td>{ticket.assignedTo?.name || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function AssignTicketsTable({ tickets, supportEmployees, handleAssign }) {
  const [assignedTickets, setAssignedTickets] = useState({});

  useEffect(() => {
    const initialAssigned = {};
    tickets.forEach((ticket) => {
      if (ticket.assignedTo?.name) {
        initialAssigned[ticket._id] = ticket.assignedTo.name;
      }
    });
    setAssignedTickets(initialAssigned);
  }, [tickets]);

  const handleLocalAssign = async (ticketId, employeeId, employeeName) => {
    await handleAssign(ticketId, employeeId);
    setAssignedTickets((prev) => ({
      ...prev,
      [ticketId]: employeeName,
    }));
  };

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Title</th>
          <th style={styles.th}>Priority</th>
          <th style={styles.th}>Status</th>
          <th style={styles.th}>Assign</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((ticket) => {
          const assignedName = assignedTickets[ticket._id];

          return (
            <tr key={ticket._id}>
              <td style={styles.td}>{ticket.title}</td>
              <td style={styles.td}>{ticket.priority}</td>
              <td style={styles.td}>{ticket.status}</td>
              <td style={styles.td}>
                {assignedName ? (
                  <span>{assignedName}</span>
                ) : (
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      const selectedEmp = supportEmployees.find(
                        (emp) => emp._id === e.target.value
                      );
                      if (selectedEmp) {
                        handleLocalAssign(
                          ticket._id,
                          selectedEmp._id,
                          selectedEmp.name
                        );
                      }
                    }}
                  >
                    <option value="">-- Select --</option>
                    {supportEmployees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function CreateEmployeeForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    designation: '',
    salary: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/support-employees/create', form);
      alert('✅ Support Employee Created');
      setForm({ name: '', email: '', password: '', department: '', designation: '', salary: '' });
    } catch (err) {
      console.error('❌ Error creating employee:', err);
      alert('❌ Creation failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ ...styles.form, maxWidth: '500px' }}>
      <h3 style={{ marginBottom: '15px' }}>➕ Create Support Employee</h3>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required style={styles.input} />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required style={styles.input} />
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required style={styles.input} />
      <input name="department" value={form.department} onChange={handleChange} placeholder="Department" style={styles.input} />
      <input name="designation" value={form.designation} onChange={handleChange} placeholder="Designation" style={styles.input} />
      <input name="salary" type="number" value={form.salary} onChange={handleChange} placeholder="Salary" style={styles.input} />
      <button type="submit" style={styles.button}>Create</button>
    </form>
  );
}

// ✅ Styles
const tabStyle = (active) => ({
  padding: '10px 16px',
  marginRight: '10px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  backgroundColor: active ? '#2563eb' : '#e0e7ff',
  color: active ? '#fff' : '#1e3a8a',
  fontWeight: 'bold',
});

const styles = {
  container: {
    padding: '30px',
    maxWidth: '1100px',
    margin: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  heading: {
    fontSize: '26px',
  },
  logoutButton: {
    padding: '10px 16px',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  navTabs: {
    display: 'flex',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  th: {
    padding: '10px',
    backgroundColor: '#f3f4f6',
    textAlign: 'left',
    borderBottom: '1px solid #e5e7eb',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #e5e7eb',
  },
  form: {
    backgroundColor: '#f9fafb',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
  },
  button: {
    padding: '10px',
    backgroundColor: '#2563eb',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%',
  },
};

export default SupportManagerDashboard;