import React, { useEffect, useState } from 'react';
import { assignTask, fetchTasks, updateTaskStatus } from '../../services/taskService';
import axios from 'axios';

const TaskManager = () => {
  const [form, setForm] = useState({
    project: '',
    assignee: '',
    title: '',
    description: '',
    priority: 'Medium',
    deadline: '',
    estimated_hours: ''
  });
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const [taskData, projectData, employeeData] = await Promise.all([
      fetchTasks(),
      axios.get('https://unifiedops-backend.onrender.com/api/projects'),
  axios.get('https://unifiedops-backend.onrender.com/api/employees/full-details')

    ]);
    setTasks(taskData);
    setProjects(projectData.data);
    setEmployees(employeeData.data);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await assignTask(form);
    setForm({ project: '', assignee: '', title: '', description: '', priority: 'Medium', deadline: '', estimated_hours: '' });
    loadAll();
  };

  const changeStatus = async (id, newStatus) => {
    await updateTaskStatus(id, newStatus);
    loadAll();
  };

  const renderColumn = (status) => (
    <div style={column}>
      <h3 style={columnTitle}>{status}</h3>
      {tasks.filter(t => t.status === status).map(task => (
        <div key={task._id} style={card}>
          <strong>{task.title}</strong>
          <p><b>👤</b> {task.assignee?.name}</p>
          <p><b>📁</b> {task.project?.name}</p>
          <p><b>⚠️</b> {task.priority}</p>
          <p><b>🕑</b> {task.estimated_hours} hrs</p>
          <p><b>📝</b> {task.description}</p>
          <p><b>📅</b> {task.deadline?.split('T')[0]}</p>
          <div style={buttonGroup}>
            {['Assigned', 'In Progress', 'Completed'].map(s => (
              s !== status && (
                <button
                  key={s}
                  onClick={() => changeStatus(task._id, s)}
                  style={{ ...button, background: statusColors[s] }}
                >
                  {s}
                </button>
              )
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ padding: 30, background: '#f0f4f9', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 20 }}>📝 Task Manager</h2>

      <form onSubmit={handleSubmit} style={formStyle}>
        <select name="project" value={form.project} onChange={handleChange} required style={input}>
          <option value="">📁 Select Project</option>
          {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
        <select name="assignee" value={form.assignee} onChange={handleChange} required style={input}>
          <option value="">👤 Select Employee</option>
          {employees.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
        </select>
        <input name="title" value={form.title} onChange={handleChange} placeholder="📌 Task Title" required style={input} />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="📝 Description" rows={2} style={input} />
        <select name="priority" value={form.priority} onChange={handleChange} style={input}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <input type="date" name="deadline" value={form.deadline} onChange={handleChange} style={input} />
        <input type="number" name="estimated_hours" value={form.estimated_hours} onChange={handleChange} placeholder="⏱ Estimated Hours" style={input} />
        <button type="submit" style={{ ...button, alignSelf: 'flex-start', marginTop: 10 }}>➕ Assign Task</button>
      </form>

      <div style={kanbanBoard}>
        {['Assigned', 'In Progress', 'Completed'].map(renderColumn)}
      </div>
    </div>
  );
};

// ====== Styles ======
const formStyle = {
  maxWidth: 700,
  margin: '0 auto 40px',
  padding: 24,
  background: '#ffffff',
  borderRadius: 16,
  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.05)',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  border: '1px solid #e0e0e0'
};

const input = {
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid #d1d5db',
  fontSize: 15,
  fontFamily: 'inherit',
  background: '#f9fafb',
  transition: 'border 0.2s ease',
};

const button = {
  padding: '6px 12px',
  margin: '4px 4px 0 0',
  border: 'none',
  borderRadius: 8,
  fontWeight: 'bold',
  fontSize: 13,
  color: '#fff',
  cursor: 'pointer',
  transition: 'background 0.2s ease',
};

const statusColors = {
  'Assigned': '#f59e0b',
  'In Progress': '#3b82f6',
  'Completed': '#10b981'
};

const kanbanBoard = {
  display: 'flex',
  gap: 20,
  justifyContent: 'space-between',
  flexWrap: 'wrap'
};

const column = {
  flex: 1,
  minWidth: 300,
  padding: 20,
  background: '#f8fafc',
  borderRadius: 12,
  boxShadow: 'inset 0 0 0 1px #e5e7eb',
  maxHeight: '80vh',
  overflowY: 'auto'
};

const columnTitle = {
  marginBottom: 10,
  fontSize: 18,
  fontWeight: 'bold',
  color: '#334155',
  borderBottom: '2px solid #cbd5e1',
  paddingBottom: 6
};

const card = {
  background: '#ffffff',
  padding: 16,
  borderRadius: 12,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
  marginBottom: 16,
  border: '1px solid #e5e7eb',
  fontSize: 14,
};

const buttonGroup = {
  display: 'flex',
  flexWrap: 'wrap',
  marginTop: 10,
};

export default TaskManager;
