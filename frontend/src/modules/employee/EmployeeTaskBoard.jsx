import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const EmployeeTaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('employeeToken');
    if (!token) return;
    const decoded = jwtDecode(token);
    const empId = decoded.userId;
    fetchEmployeeWithTasks(empId);
  }, []);

  const fetchEmployeeWithTasks = async (empId) => {
    try {
     const res = await axios.get(`https://unifiedops-backend.onrender.com/api/employees/${empId}`);
      setEmployee(res.data);
      const allTasks = res.data.projects?.flatMap(p =>
        p.tasks?.map(t => ({ ...t, projectName: p.name })) || []
      ) || [];
      setTasks(allTasks);
    } catch (err) {
      console.error('Error fetching employee tasks:', err);
    }
  };

  const changeStatus = async (taskId, newStatus) => {
    try {
     await axios.patch(`https://unifiedops-backend.onrender.com/api/tasks/${taskId}/status`, {
  status: newStatus,
});

      fetchEmployeeWithTasks(employee._id);
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleBackToDashboard = async () => {
    // Move all "In Progress" tasks back to "Assigned" and stop timer
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
    await Promise.all(
      inProgressTasks.map(task =>
      axios.patch(`https://unifiedops-backend.onrender.com/api/tasks/${task._id}/status`, { status: 'Assigned' })

      )
    );
    navigate('/employee/dashboard');
  };

  const renderColumn = (status) => (
    <div style={column}>
      <h3>{status}</h3>
      {tasks.filter(t => t.status === status).map(task => (
        <div key={task._id} style={card}>
          <strong>{task.title}</strong>
          <p><b>📁 Project:</b> {task.projectName || 'N/A'}</p>
          <p><b>📝 Desc:</b> {task.description}</p>
          <p><b>⚠️ Priority:</b> {task.priority}</p>
          <p><b>📅 Deadline:</b> {task.deadline?.split('T')[0]}</p>
          <p><b>🕑 Hours:</b> {task.estimated_hours}</p>
          <p><b>⏱ Time Spent:</b> {formatSeconds(task.totalWorkedTimeInSeconds || 0)}</p>
          <p><b>📌 Status:</b> {task.status}</p>
          <div style={{ marginTop: 10 }}>
            {['Assigned', 'In Progress', 'Completed']
              .filter(s => s !== status)
              .map(s => (
                <button key={s} onClick={() => changeStatus(task._id, s)} style={button}>
                  Mark {s}
                </button>
              ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ padding: 40, background: '#eef3f9', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center' }}>
        📂 {employee?.name}'s Task Board
      </h2>
      <div style={{ textAlign: 'center', marginTop: 10 }}>
        <button onClick={handleBackToDashboard} style={backBtn}>
          🔙 Back to Dashboard
        </button>
      </div>
      <div style={{ display: 'flex', gap: 20, marginTop: 40 }}>
        {['Assigned', 'In Progress', 'Completed'].map(renderColumn)}
      </div>
    </div>
  );
};

// 🕐 Format seconds to "HH:mm:ss"
const formatSeconds = (totalSeconds) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h}h ${m}m ${s}s`;
};

const column = { flex: 1, padding: 20, background: '#f3f7ff', borderRadius: 12 };
const card = { background: '#fff', padding: 12, borderRadius: 10, boxShadow: '0 4px 10px rgba(0,0,0,0.05)', marginBottom: 12 };
const button = { padding: '6px 10px', margin: '4px', border: 'none', borderRadius: 6, background: '#3c5ccf', color: '#fff', cursor: 'pointer' };
const backBtn = { padding: '8px 14px', borderRadius: 8, background: '#444', color: '#fff', border: 'none', cursor: 'pointer' };

export default EmployeeTaskBoard;
