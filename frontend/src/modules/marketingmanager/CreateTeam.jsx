import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CreateTeam() {
  const [teamName, setTeamName] = useState('');
  const [employees, setEmployees] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [teamLeadId, setTeamLeadId] = useState('');
  const [teams, setTeams] = useState([]);
  const [editingTeamId, setEditingTeamId] = useState(null);
  const baseURL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, teamRes] = await Promise.all([
          axios.get('${baseURL}/api/marketing-employees'),
          axios.get('${baseURL}/api/marketing-teams'),
        ]);
        setEmployees(empRes.data);
        setTeams(teamRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  const isMemberInAnotherTeam = (memberId) => {
    return teams.some(team =>
      team._id !== editingTeamId && team.members.some(m => m._id === memberId)
    );
  };

  const handleCheckboxChange = (id) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers(selectedMembers.filter(memberId => memberId !== id));
      if (teamLeadId === id) setTeamLeadId('');
    } else {
      if (isMemberInAnotherTeam(id)) {
        alert('This employee is already assigned to another team.');
        return;
      }
      setSelectedMembers([...selectedMembers, id]);
    }
  };

  const handleSubmit = async () => {
    if (!teamName || selectedMembers.length === 0 || !teamLeadId) {
      return alert('Team name, members, and team lead are required.');
    }

    if (!selectedMembers.includes(teamLeadId)) {
      return alert('Selected team lead must be one of the team members.');
    }

    try {
      if (editingTeamId) {
        await axios.put(`${baseURL}/api/marketing-teams/${editingTeamId}`, {
          name: teamName,
          memberIds: selectedMembers,
          teamLeadId,
        });
        alert('Team updated successfully!');
      } else {
        await axios.post(`${baseURL}/api/marketing-teams`, {
          name: teamName,
          memberIds: selectedMembers,
          teamLeadId,
        });
        alert('Team created successfully!');
      }

      setTeamName('');
      setSelectedMembers([]);
      setTeamLeadId('');
      setEditingTeamId(null);

      const updatedTeams = await axios.get(`${baseURL}/api/marketing-teams`);
      setTeams(updatedTeams.data);
    } catch (error) {
      console.error('Error submitting team:', error);
      alert(error.response?.data?.message || 'Error submitting team');
    }
  };

  const handleEdit = (team) => {
    setTeamName(team.name);
    setSelectedMembers(team.members.map((m) => m._id));
    setTeamLeadId(team.teamLead._id);
    setEditingTeamId(team._id);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>{editingTeamId ? 'Update' : 'Create'} Marketing Team</h2>

      <input
        type="text"
        placeholder="Team Name *"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        style={styles.input}
      />

      <div style={styles.section}>
        <h3 style={styles.subheading}>Select Team Members:</h3>
        {employees.map((emp) => (
          <label key={emp._id} style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={selectedMembers.includes(emp._id)}
              onChange={() => handleCheckboxChange(emp._id)}
            />
            {emp.name} ({emp.designation})
          </label>
        ))}
      </div>

      {selectedMembers.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.subheading}>Select Team Lead:</h3>
          <select
            value={teamLeadId}
            onChange={(e) => setTeamLeadId(e.target.value)}
            style={styles.select}
          >
            <option value="">-- Select Lead --</option>
            {employees
              .filter((emp) => selectedMembers.includes(emp._id))
              .map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name}
                </option>
              ))}
          </select>
        </div>
      )}

      <button onClick={handleSubmit} style={styles.button}>
        {editingTeamId ? 'Update Team' : 'Create Team'}
      </button>

      <hr style={{ margin: '40px 0' }} />
      <div style={styles.teamListSection}>
  <h3 style={styles.subheading}>Existing Teams:</h3>
  {teams.map((team) => (
    <div key={team._id} style={styles.teamCard}>
      <div>
        <strong style={styles.teamName}>{team.name}</strong>
        <div style={styles.teamLead}>Team Lead: {team.teamLead?.name}</div>
        <div style={styles.memberCount}>Members: {team.members?.length}</div>
      </div>
      <button style={styles.editButton} onClick={() => handleEdit(team)}>
        ✏️ Edit
      </button>
    </div>
  ))}
</div>

    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: '40px auto',
    padding: 24,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    boxShadow: '0 0 10px rgba(0,0,0,0.05)',
    fontFamily: 'Segoe UI, sans-serif',
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#1f2937',
  },
  subheading: {
    fontSize: 18,
    marginBottom: 10,
    color: '#374151',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    marginBottom: 20,
    border: '1px solid #d1d5db',
    borderRadius: 8,
    fontSize: 16,
  },
  checkboxLabel: {
    display: 'block',
    marginBottom: 10,
    fontSize: 15,
    color: '#4b5563',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid #d1d5db',
    fontSize: 16,
  },
  section: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '12px 20px',
    border: 'none',
    borderRadius: 8,
    fontSize: 16,
    cursor: 'pointer',
    width: '100%',
  },
  teamListSection: {
  marginTop: 30,
},

teamCard: {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  padding: '12px 16px',
  marginBottom: 12,
},

teamName: {
  fontSize: 16,
  color: '#111827',
},

teamLead: {
  fontSize: 14,
  color: '#374151',
  marginTop: 4,
},

memberCount: {
  fontSize: 13,
  color: '#6b7280',
  marginTop: 2,
},

editButton: {
  backgroundColor: '#10b981',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: 6,
  cursor: 'pointer',
  fontSize: 14,
},

};

export default CreateTeam;
