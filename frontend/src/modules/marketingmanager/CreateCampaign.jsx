import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CreateCampaign() {
  const [form, setForm] = useState({
    title: '',
    date: '',
    time: '',
    mode: 'online',
    location: '',
    expectedPeople: '',
    actualPeople: '',
    agenda: '',
    assignedTeam: '',
  });
  const baseURL = process.env.REACT_APP_API_BASE_URL;

  const [teams, setTeams] = useState([]);

  useEffect(() => {
    axios.get('${baseURL}api/marketing-teams')
      .then((res) => setTeams(res.data))
      .catch((err) => console.error('Error fetching teams:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, date, time, mode, expectedPeople, assignedTeam } = form;
    if (!title || !date || !time || !mode || !expectedPeople || !assignedTeam) {
      return alert('Please fill all required fields');
    }

    try {
      const payload = { ...form };
      await axios.post('${baseURL}api/campaigns', payload);
      alert('Campaign created successfully');
      setForm({
        title: '',
        date: '',
        time: '',
        mode: 'online',
        location: '',
        expectedPeople: '',
        actualPeople: '',
        agenda: '',
        assignedTeam: '',
      });
    } catch (err) {
      console.error('Axios Error:', err.response?.data || err);
      alert('Error creating campaign');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Create Marketing Campaign</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="text" name="title" placeholder="Campaign Title *" value={form.title} onChange={handleChange} style={styles.input} />
        <input type="date" name="date" value={form.date} onChange={handleChange} style={styles.input} />
        <input type="time" name="time" value={form.time} onChange={handleChange} style={styles.input} />

        <select name="mode" value={form.mode} onChange={handleChange} style={styles.input}>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>

        {form.mode === 'offline' && (
          <input type="text" name="location" placeholder="Location (if offline)" value={form.location} onChange={handleChange} style={styles.input} />
        )}

        <input type="number" name="expectedPeople" placeholder="Expected People *" value={form.expectedPeople} onChange={handleChange} style={styles.input} />
        <input type="number" name="actualPeople" placeholder="Actual People" value={form.actualPeople} onChange={handleChange} style={styles.input} />

        <textarea
          name="agenda"
          placeholder="Campaign Agenda or Goal"
          value={form.agenda}
          onChange={handleChange}
          style={{ ...styles.input, height: 100 }}
        />

        <select name="assignedTeam" value={form.assignedTeam} onChange={handleChange} style={styles.input}>
          <option value="">-- Select Team --</option>
          {teams.map(t => (
            <option key={t._id} value={t._id}>{t.name}</option>
          ))}
        </select>

        <button type="submit" style={styles.button}>Create Campaign</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: '40px auto',
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 10,
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
  },
  heading: { fontSize: 22, marginBottom: 20 },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  input: {
    padding: 10,
    fontSize: 16,
    border: '1px solid #ccc',
    borderRadius: 6
  },
  button: {
    padding: 12,
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer'
  },
};

export default CreateCampaign;
