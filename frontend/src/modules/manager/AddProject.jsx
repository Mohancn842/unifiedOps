import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AddProject = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'Planned',
  });
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('${baseURL}/api/projects');
      setProjects(res.data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      alert('❌ Error loading project list');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     await axios.post('${baseURL}/api/projects', form);
      alert('✅ Project added successfully!');
      setForm({ name: '', description: '', start_date: '', end_date: '', status: 'Planned' });
      fetchProjects(); // Refresh list
    } catch (err) {
      console.error(err);
      alert('❌ Failed to add project');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📁 Manage Projects</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Project Name"
          required
          style={styles.input}
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          rows={3}
          style={styles.input}
        />
        <input
          type="date"
          name="start_date"
          value={form.start_date}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="date"
          name="end_date"
          value={form.end_date}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="Planned">Planned</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <button type="submit" style={styles.button}>➕ Add Project</button>
      </form>

      <h3 style={styles.subHeading}>📋 Project List</h3>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Start</th>
              <th style={styles.th}>End</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan="5" style={styles.noData}>No projects found.</td>
              </tr>
            ) : (
              projects.map((p, i) => (
                <tr key={p._id} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                  <td style={styles.td}>{i + 1}</td>
                  <td style={styles.td}>{p.name}</td>
                  <td style={styles.td}>{p.start_date?.split('T')[0]}</td>
                  <td style={styles.td}>{p.end_date?.split('T')[0]}</td>
                  <td style={styles.td}>
                    <span style={getStatusStyle(p.status)}>{p.status}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const getStatusStyle = (status) => {
  const base = {
    padding: '4px 10px',
    borderRadius: '12px',
    fontWeight: 'bold',
    fontSize: '13px',
  };
  switch (status) {
    case 'In Progress':
      return { ...base, backgroundColor: '#e8f0fe', color: '#3c5ccf' };
    case 'Completed':
      return { ...base, backgroundColor: '#e1f7e6', color: '#2e8b57' };
    case 'Planned':
    default:
      return { ...base, backgroundColor: '#fff4d6', color: '#b67e00' };
  }
};

const styles = {
  container: {
    padding: 40,
    background: '#edf2f9',
    minHeight: '100vh',
    fontFamily: 'sans-serif',
  },
  heading: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 24,
  },
  form: {
    maxWidth: 600,
    margin: 'auto',
    background: '#fff',
    padding: 24,
    borderRadius: 16,
    boxShadow: '0 6px 15px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  input: {
    padding: 10,
    borderRadius: 8,
    border: '1px solid #ccc',
    fontSize: 14,
  },
  button: {
    padding: 12,
    background: '#3c5ccf',
    color: '#fff',
    border: 'none',
    borderRadius: 20,
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: 16,
  },
  subHeading: {
    marginTop: 50,
    textAlign: 'center',
    fontSize: 20,
  },
  tableWrapper: {
    marginTop: 20,
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    borderRadius: 12,
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
  },
  tableHeader: {
    backgroundColor: '#3c5ccf',
    color: '#fff',
  },
  th: {
    padding: '12px',
    textAlign: 'left',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #eee',
  },
  rowEven: {
    backgroundColor: '#f9f9f9',
  },
  rowOdd: {
    backgroundColor: '#ffffff',
  },
  noData: {
    padding: 20,
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
  },
};

export default AddProject;
