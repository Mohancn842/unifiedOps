import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ViewCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [editId, setEditId] = useState(null);
  const baseURL = process.env.REACT_APP_API_BASE_URL;

  const [form, setForm] = useState({
    name: '',
    date: '',
    time: '',
    mode: 'online',
    location: '',
    expectedPeople: '',
    actualPeople: '',
    agenda: '',
    team: '',
  });
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetchCampaigns();
    fetchTeams();
  }, []);

  const fetchCampaigns = () => {
    axios.get(`${baseURL}/api/campaigns`)
      .then(res => setCampaigns(res.data))
      .catch(err => console.error('Error fetching campaigns:', err));
  };

  const fetchTeams = () => {
    axios.get(`${baseURL}/api/marketing-teams`)
      .then(res => setTeams(res.data))
      .catch(err => console.error('Error fetching teams:', err));
  };

  const handleEdit = (c) => {
    setEditId(c._id);
    setForm({
      name: c.title,
      date: c.date,
      time: c.time,
      mode: c.mode,
      location: c.location || '',
      expectedPeople: c.expectedPeople,
      actualPeople: c.actualPeople || '',
      agenda: c.agenda || '',
      team: c.assignedTeam?._id || '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${baseURL}/api/campaigns/${editId}`, form);
      alert('Campaign updated');
      setEditId(null);
      fetchCampaigns();
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>All Marketing Campaigns</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Mode</th>
            <th>Location</th>
            <th>Expected</th>
            <th>Actual</th>
            <th>Agenda</th>
            <th>Team</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => (
            <tr key={c._id}>
              <td>{c.title}</td>
              <td>{c.date?.slice(0, 10)}</td>
              <td>{c.time}</td>
              <td>{c.mode}</td>
              <td>{c.mode === 'offline' ? c.location : '-'}</td>
              <td>{c.expectedPeople}</td>
              <td>{c.actualPeople || '-'}</td>
              <td>{c.agenda || '-'}</td>
             <td>{c.assignedTeam?.name || '-'}</td>

              <td>
                <button style={styles.editBtn} onClick={() => handleEdit(c)}>✏️ Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editId && (
        <div style={styles.editBox}>
          <h3>Edit Campaign</h3>
          <form onSubmit={e => { e.preventDefault(); handleUpdate(); }} style={styles.form}>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" style={styles.input} />
            <input name="date" type="date" value={form.date} onChange={handleChange} style={styles.input} />
            <input name="time" type="time" value={form.time} onChange={handleChange} style={styles.input} />

            <select name="mode" value={form.mode} onChange={handleChange} style={styles.input}>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>

            {form.mode === 'offline' && (
              <input name="location" value={form.location} onChange={handleChange} placeholder="Location" style={styles.input} />
            )}

            <input name="expectedPeople" type="number" value={form.expectedPeople} onChange={handleChange} placeholder="Expected" style={styles.input} />
            <input name="actualPeople" type="number" value={form.actualPeople} onChange={handleChange} placeholder="Actual" style={styles.input} />
            <textarea name="agenda" value={form.agenda} onChange={handleChange} placeholder="Agenda" style={{ ...styles.input, height: 80 }} />

            <select name="team" value={form.team} onChange={handleChange} style={styles.input}>
              <option value="">-- Select Team --</option>
              {teams.map(t => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>

            <button type="submit" style={styles.button}>Update</button>
            <button type="button" onClick={() => setEditId(null)} style={styles.cancelBtn}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '30px', maxWidth: '1000px', margin: 'auto' },
  heading: { fontSize: '24px', marginBottom: '20px' },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    background: '#fff',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  editBtn: {
    padding: '6px 12px',
    backgroundColor: '#facc15',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  editBox: {
    marginTop: '30px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    backgroundColor: '#f9fafb',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: {
    padding: '10px',
    fontSize: '15px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    backgroundColor: '#3b82f6',
    color: '#fff',
    padding: '10px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  cancelBtn: {
    backgroundColor: '#ef4444',
    color: '#fff',
    padding: '10px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default ViewCampaigns;
