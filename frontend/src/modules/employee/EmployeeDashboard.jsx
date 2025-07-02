// src/components/EmployeeDashboard.jsx

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';



import { jwtDecode } from 'jwt-decode';
import {
  FiLogOut, FiFolder, FiCheckSquare, FiUser,FiKey,
  FiCalendar, FiHome, FiClock, FiList,FiUsers,FiBell,
} from 'react-icons/fi';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('welcome');
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const employeeIdRef = useRef(null);
const [taskHistory, setTaskHistory] = useState([]);
const [statusFilter, setStatusFilter] = useState('');
const [projectFilter, setProjectFilter] = useState('');
const [showLeaveForm, setShowLeaveForm] = useState(false);
const [leaveDate, setLeaveDate] = useState('');
const [leaveReason, setLeaveReason] = useState('');
const [leaveHistory, setLeaveHistory] = useState([]);
const alertedRef = useRef(false);
const [teamMembers, setTeamMembers] = useState([]);
const [teamLoading, setTeamLoading] = useState(false);
const [notifications, setNotifications] = useState([]);
const unreadCount = notifications.filter(n => !n.isRead).length;

 // Top of EmployeeDashboard component
const [monthlyPresent, setMonthlyPresent] = useState(0);
const [attendanceMarked, setAttendanceMarked] = useState(false);
const workingDays = 20;


//const [unreadCount, setUnreadCount] = useState(0);


// Decode token// Decode employeeToken and extract employeeId
const decodedToken = localStorage.getItem('employeeToken')
  ? JSON.parse(atob(localStorage.getItem('employeeToken').split('.')[1]))
  : {};
const [employeeId, setEmployeeId] = useState(decodedToken?.userId || null);

 // or decodedToken.id depending on backend
useEffect(() => {
  const token = localStorage.getItem('employeeToken');
  if (token) {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    setEmployeeId(decoded.userId); // set employeeId from JWT
  }
}, []);

useEffect(() => {
  if (activeView === 'notifications' && employeeId) {
    axios
      .get(`https://unifiedops-backend.onrender.com/api/notifications/employee/${employeeId}`)
      .then(res => setNotifications(res.data))
      .catch(err => console.error('Failed to load notifications:', err));
  }
}, [activeView, employeeId]);
  
useEffect(() => {
  if (activeView === 'team' && employeeId) {
    setTeamLoading(true);
    axios.get(`https://unifiedops-backend.onrender.com/api/employees/team/${employeeId}`)
      .then(res => setTeamMembers(res.data))
      .catch(err => console.error('❌ Team fetch error:', err))
      .finally(() => setTeamLoading(false));
  }
}, [activeView, employeeId]);

// ✅ Fetch attendance once when activeView is "attendance"
useEffect(() => {
  if (activeView === 'attendance' && employeeId) {
    
      axios.get(`https://unifiedops-backend.onrender.com/api/attendance/${employeeId}/monthly`)
      .then((response) => {
        setMonthlyPresent(response.data.presentDays);
        setAttendanceMarked(response.data.todayMarked);
      })
      .catch((err) => {
        console.error('❌ Failed to load attendance:', err);
      });
  }
}, [activeView, employeeId]);
useEffect(() => {
  if (activeView === 'attendance' && employeeId) {
    axios.get(`https://unifiedops-backend.onrender.com/api/leaves/${employeeId}/history`)
      .then(res => setLeaveHistory(res.data))
      .catch(err => console.error('Failed to load leave history', err));
  }
}, [activeView, employeeId]);


// ✅ Mark Attendance Function
const markAttendance = async () => {
  if (!employeeId) {
    console.error('❌ employeeId not found.');
    return;
  }
try {
  await axios.post('https://unifiedops-backend.onrender.com/api/attendance/mark', { employeeId });
  setAttendanceMarked(true);
  setMonthlyPresent(prev => prev + 1);
  alert('✅ Attendance marked successfully!');
} catch (err) {
  console.error('❌ Attendance error:', err);
  alert('Failed to mark attendance. You may have already marked it.');
}

// ✅ Apply Leave Functionconst
 const submitLeave = async () => {
  if (!leaveDate || !leaveReason) {
    alert("Please enter both leave date and reason.");
    return;
  }

  if (leaveDate === new Date().toISOString().split('T')[0] && attendanceMarked) {
    alert('You already marked present today. You cannot apply leave for today.');
    return;
  }

try {
  await axios.post('https://unifiedops-backend.onrender.com/api/leaves/apply', {
    employeeId,
    date: leaveDate,
    reason: leaveReason
  });


  const res = await axios.get(`https://unifiedops-backend.onrender.com/api/leaves/${employeeId}/history`);
setLeaveHistory(res.data);

alert('Leave application submitted.');

setLeaveDate('');
setLeaveReason('');
setShowLeaveForm(false);
  } catch (err) {
    console.error('Leave submission error:', err);
    if (err.response?.data?.message) {
      alert(err.response.data.message);
    } else {
      alert('Failed to submit leave.');
    }
  }
};


 

 
  const logoutAndRedirect = useCallback(async () => {
    try {
      const employeeId = employeeIdRef.current;
      if (employeeId) {
       await axios.post('https://unifiedops-backend.onrender.com/api/auth/logout', { employeeId });

      }
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      localStorage.removeItem('employeeToken');
      navigate('/employee/login', { replace: true });
    }
  }, [navigate]);
useEffect(() => {
  const handleBack = (event) => {
    event.preventDefault();
    logoutAndRedirect(); // trigger logout
  };

  window.addEventListener('popstate', handleBack);
  return () => {
    window.removeEventListener('popstate', handleBack);
  };
}, [logoutAndRedirect]);

 useEffect(() => {
  const handleBack = (event) => {
    event.preventDefault();
    logoutAndRedirect(); // trigger logout
  };

  window.addEventListener('popstate', handleBack);
  return () => {
    window.removeEventListener('popstate', handleBack);
  };
}, [logoutAndRedirect]);



  useEffect(() => {
    const token = localStorage.getItem('employeeToken');
    if (!token) return logoutAndRedirect();

    try {
      const decoded = jwtDecode(token);
      const employeeId = decoded.userId;
      employeeIdRef.current = employeeId;

      axios.get(`https://unifiedops-backend.onrender.com/api/employees/${employeeId}`)
  .then(res => {
    setEmployee(res.data);
    return axios.get(`https://unifiedops-backend.onrender.com/api/sessions/${employeeId}`);
  })
        .then(res => {
          setSessions(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching data:', err);
          logoutAndRedirect();
        });
    } catch (err) {
      console.error('Invalid token:', err);
      logoutAndRedirect();
    }
  }, [logoutAndRedirect]);
  const id = employeeIdRef.current;
if (id) {
 axios.get(`https://unifiedops-backend.onrender.com/api/tasks/history/${id}`)
    .then(res => {
      setTaskHistory(res.data);
    })
    .catch(err => {
      console.error('Error fetching task history:', err);
    });
}
  useEffect(() => {
    const handleUnload = () => {
      const employeeId = employeeIdRef.current;
      if (employeeId) {
        const data = JSON.stringify({ employeeId });
        navigator.sendBeacon(
          'http://localhost:5000/api/auth/logout',
          new Blob([data], { type: 'application/json' })
        );
      }
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);
useEffect(() => {
  if (
    activeView === 'welcome' &&
    employee?.contract_expiry &&
    !alertedRef.current
  ) {
    const expiryDate = new Date(employee.contract_expiry);
    const today = new Date();
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (!isNaN(diffDays) && diffDays <= 30) {
      alertedRef.current = true;
      alert(
        diffDays >= 0
          ? `⚠️ Your contract will expire in ${diffDays} day(s). Please contact HR.`
          : `❗ Your contract expired ${Math.abs(diffDays)} day(s) ago. Please contact HR immediately.`
      );
    }
  }
}, [activeView, employee?.contract_expiry]);



  const formatDuration = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const handleExportPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(16);
doc.text('UnifiedOps - Employee Session Report', 14, 20);

doc.setFontSize(12);
doc.text(`Employee: ${employee.name}`, 14, 30); // moved down

doc.setFontSize(10);
doc.text(
  'Note: This report is visible only to the employee. Please verify through Manager or HR login.',
  14,
  38 // also moved down
);
  let startY = 35;

  // Filter sessions
  const filteredSessions = filterDate
    ? sessions.filter(s => new Date(s.loginTime).toISOString().split('T')[0] === filterDate)
    : sessions;

  // Group by date
  const grouped = filteredSessions.reduce((acc, s) => {
    const dateKey = new Date(s.loginTime).toLocaleDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(s);
    return acc;
  }, {});

  if (Object.keys(grouped).length === 0) {
    doc.text('No session records available for the selected date.', 14, 40);
  }

  Object.entries(grouped).forEach(([date, logs]) => {
    let totalMs = 0;
    const rows = logs.map(s => {
      const login = new Date(s.loginTime);
      const logout = s.logoutTime ? new Date(s.logoutTime) : null;
      const duration = logout ? logout - login : new Date() - login;
      totalMs += duration;

      return [
        login.toLocaleTimeString(),
        logout ? logout.toLocaleTimeString() : 'Active',
        formatDuration(duration),
        logout ? 'Completed' : 'Active'
      ];
    });

    autoTable(doc, {
      startY,
      head: [[`Date: ${date}`, '', '', '']],
      body: [],
      theme: 'grid',
      styles: { fontStyle: 'bold' }
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 2,
      head: [['Login Time', 'Logout Time', 'Duration', 'Status']],
      body: rows,
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 2,
      body: [[`Total Duration for ${date}: ${formatDuration(totalMs)}`]],
      styles: { fontStyle: 'bold', textColor: '#4f46e5' },
      theme: 'plain',
    });

    startY = doc.lastAutoTable.finalY + 10;
  });

  // Watermark
  doc.setTextColor(220);
  doc.setFontSize(60);
  doc.text('UNIFIEDOPS', 35, 150, { angle: 45 });

  const fileName = filterDate
    ? `Session_Report_${employee.name}_${filterDate}.pdf`
    : `Session_Report_${employee.name}.pdf`;

  doc.save(fileName);
};



const handleExportExcel = () => {
  const filteredSessions = filterDate
    ? sessions.filter(s => new Date(s.loginTime).toISOString().split('T')[0] === filterDate)
    : sessions;

  const grouped = filteredSessions.reduce((acc, s) => {
    const dateKey = new Date(s.loginTime).toLocaleDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(s);
    return acc;
  }, {});

  const data = [];
  data.push({ Date: `Employee: ${employee.name}`, Login: '', Logout: '', Duration: '', Status: '' });
  data.push({}); // Empty row for spacing

  Object.entries(grouped).forEach(([date, logs]) => {
    let totalMs = 0;

    data.push({ Date: date, Login: '', Logout: '', Duration: '', Status: '' }); // Header row

    logs.forEach((s) => {
      const login = new Date(s.loginTime);
      const logout = s.logoutTime ? new Date(s.logoutTime) : null;
      const duration = logout ? logout - login : new Date() - login;
      totalMs += duration;

      data.push({
        Date: '',
        Login: login.toLocaleTimeString(),
        Logout: logout ? logout.toLocaleTimeString() : 'Active',
        Duration: formatDuration(duration),
        Status: logout ? 'Completed' : 'Active',
      });
    });

    data.push({
      Date: '',
      Login: '',
      Logout: '',
      Duration: `Total: ${formatDuration(totalMs)}`,
      Status: ''
    });
  });

  if (data.length === 0) {
    alert("No session records available for the selected date.");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sessions');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });

  const fileName = filterDate
    ? `Session_Report_${employee.name}_${filterDate}.xlsx`
    : `Session_Report_${employee.name}.xlsx`;

  saveAs(dataBlob, fileName);
};


  const allTasks = employee?.projects?.flatMap((project) =>
    project.tasks?.map(task => ({ ...task, projectName: project.name })) || []
  ) || [];

  if (loading) return <div className="loading">Loading dashboard...</div>;
const calculateProjectProgress = (projectName) => {
  const projectTasks = allTasks.filter(task => task.projectName === projectName);
  if (projectTasks.length === 0) return 0;
  const completed = projectTasks.filter(task => task.status.toLowerCase() === 'completed').length;
  return Math.round((completed / projectTasks.length) * 100);
};


  const renderContent = () => {
    switch (activeView) {
    case 'welcome':
  //const today = new Date();

  return (
    <div className="dashboard-content">
      <h1>Welcome, {employee.name} </h1>
       <p>
  <b>Contract Expiry:</b>{' '}
  <span
    style={{
      fontWeight: 'bold',
      backgroundColor: '#FFCCCB', // light blue background
      padding: '4px 8px',
      borderRadius: '6px',
      display: 'inline-block',
    }}
  >
    {new Date(employee.contract_expiry).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })}
  </span>
</p>


      {/* Employee Info */}
    <section className="employee-info-section">
  <h2>👤 Employee Information</h2>
  <div className="employee-info-container">
    <div className="employee-profile">
      <img src="/avatar.png" alt="Avatar" className="avatar" />
      <div>
        <h3>{employee.name}</h3>
        <p>{employee.designation}</p>
        <p>Employee ID: {employee._id}</p>
      </div>
    </div>

    <div className="employee-actions">
      <button className="start-btn" onClick={() => setActiveView('tasks')}>
         Let's Start the Work!
      </button>
      <button className="logout-btn-secondary" onClick={logoutAndRedirect}>
        🔓 Logout
      </button>
    </div>
  </div>
</section>

      {/* Project Assignments */}
      <section className="project-assignments">
  <h2>Project Assignments</h2>
  <table className="project-table">
    <thead>
      <tr>
        <th>Project Name</th>
        <th>Start Date</th>
        <th>End Date</th>
        <th>Deadline</th>
        <th>Progress</th>
      </tr>
    </thead>
    <tbody>
      {employee.projects?.map((project, idx) => {
        const startDate = new Date(project.start_date);
        const endDate = new Date(project.end_date);
        const today = new Date();
        const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
        const isOverdue = endDate < today;
        const progress = calculateProjectProgress(project.name); // ✅ dynamic from tasks

        return (
          <tr key={idx} className={isOverdue ? 'project-row-overdue' : ''}>
            <td>{project.name}</td>
            <td>{startDate.toLocaleDateString()}</td>
            <td>{endDate.toLocaleDateString()}</td>
            <td>
              {isOverdue ? (
                <span className="deadline-overdue">Overdue</span>
              ) : (
                <span className="deadline-upcoming">{daysLeft} day(s) left</span>
              )}
            </td>
           <td>
  <div
    className="progress-circle"
    style={{
      background: `conic-gradient(#4f46e5 ${progress}%, #e5e7eb ${progress}% 100%)`
    }}
  >
    <span className="progress-label">{progress}%</span>
  </div>
</td>

          </tr>
        );
      })}
    </tbody>
  </table>
</section>



      {/* Task Statuses */}
      <section>
        <h2> Task Statuses</h2>
        <table className="project-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Project</th>
              <th>Status</th>
              <th>Due</th>
            </tr>
          </thead>
          <tbody>
            {allTasks.map((task, idx) => (
              <tr key={idx}>
                <td>{task.title}</td>
                <td>{task.projectName}</td>
                <td>
                  <span className={`status-badge ${task.status.toLowerCase()}`}>
                    {task.status}
                  </span>
                </td>
                <td>{new Date(task.deadline).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Performance */}
     <section className="performance-section">
  <h2> Performance Metrics</h2>
  <div className="circle-metrics">
    {/* Tasks Completed */}
    <div className="circle-chart">
      <div
        className="outer-circle"
        style={{
          '--progress': `${Math.min(
            100,
            Math.floor(
              (allTasks.filter((t) => t.status === 'Completed').length / allTasks.length) * 100
            ) || 0
          )}`,
        }}
      >
        <div className="inner-circle">
          <div className="metric-value">
            {Math.min(
              100,
              Math.floor(
                (allTasks.filter((t) => t.status === 'Completed').length / allTasks.length) * 100
              )
            ) || 0}
            %
          </div>
          <div className="metric-label">Tasks Completed</div>
        </div>
      </div>
    </div>

    {/* Projects Involved */}
    <div className="circle-chart">
      <div
        className="outer-circle"
        style={{
          '--progress': `${Math.min(100, (employee.projects?.length || 0) * 10)}`,
        }}
      >
        <div className="inner-circle">
          <div className="metric-value">{employee.projects?.length || 0}</div>
          <div className="metric-label">Projects Involved</div>
        </div>
      </div>
    </div>

    {/* Average Completion */}
    <div className="circle-chart">
      <div
        className="outer-circle"
        style={{
          '--progress': `75`,
        }}
      >
        <div className="inner-circle">
          <div className="metric-value">2w</div>
          <div className="metric-label">Avg Completion</div>
        </div>
      </div>
    </div>
  </div>
</section>



    </div>
  );
 case 'notifications':
  return (
    <div>
      <div className="header-row">
        <h2>🔔 Notifications</h2>
        <button className="back-btn" onClick={() => setActiveView('welcome')}>
          ⬅ Back
        </button>
      </div>

      <div className="card" style={{ padding: '20px' }}>

        {/* 🔴 Unread summary */}
        {unreadCount > 0 && (
          <div style={{
            marginBottom: '15px',
            backgroundColor: '#fff4cc',
            padding: '10px',
            borderRadius: '6px',
            fontWeight: 'bold',
            color: '#7c5900',
            border: '1px solid #ffe58f'
          }}>
            🔔 You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}.
          </div>
        )}

        {/* ✅ Mark all as read */}
        <button
          onClick={async () => {
           await axios.patch(`https://unifiedops-backend.onrender.com/api/notifications/employee/${employeeId}/markAllAsRead`);
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
          }}
          style={{
            marginBottom: '20px',
            padding: '6px 12px',
            background: '#2575fc',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          ✅ Mark All as Read
        </button>

        {/* Notification list */}
        {notifications.length === 0 ? (
          <p>No notifications found.</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              onClick={async () => {
              await axios.patch(`https://unifiedops-backend.onrender.com/api/notifications/${n._id}/markAsRead`);
                setNotifications(prev =>
                  prev.map(item =>
                    item._id === n._id ? { ...item, isRead: true } : item
                  )
                );
              }}
              style={{
                backgroundColor: n.isRead ? '#f5f5f5' : '#fff8cc',
                padding: '10px 14px',
                marginBottom: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontWeight: n.isRead ? 'normal' : 'bold', fontSize: '15px' }}>
                {n.message}
              </div>
              <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>
                {new Date(n.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

case 'info':
  
  
  return (
    <div>
      <div className="header-row">
        <h2>My Info</h2>
        <button className="back-btn" onClick={() => setActiveView('welcome')}>
          ⬅ Back
        </button>
      </div>

      <div className="card">
        <p><b>Name:</b> {employee.name}</p>
        <p><b>Email:</b> {employee.email}</p>
        <p><b>Department:</b> {employee.department}</p>
        <p><b>Designation:</b> {employee.designation}</p>
        <p><b>Salary:</b> ₹{employee.salary}</p>
        <p><b>Join Date:</b> {new Date(employee.join_date).toLocaleDateString()}</p>
        <p><b>Contract Expiry:</b> {new Date(employee.contract_expiry).toLocaleDateString()}</p>

        {/* Days Remaining with color badge */}
        {(() => {
          const expiryDate = new Date(employee.contract_expiry);
          const today = new Date();
          const diffTime = expiryDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const isExpired = diffDays < 0;

          const badgeStyle = {
            display: 'inline-block',
            padding: '4px 10px',
            borderRadius: '12px',
            backgroundColor: isExpired
              ? '#ffcccc'
              : diffDays <= 30
              ? '#fff4cc'
              : '#ccffd6',
            color: '#333',
            fontWeight: 'bold',
            marginLeft: '10px',
          };

          return (
            <p>
              <b>Days Remaining:</b>
              <span style={badgeStyle}>
                {isExpired
                  ? `Expired ${Math.abs(diffDays)} day(s) ago`
                  : `${diffDays} day(s) left`}
              </span>
            </p>
          );
        })()}

        {/* Offer letter view button */}
        {employee.contract_file ? (
          <div style={{ marginTop: '10px' }}>
            <b>Offer Letter:</b>{' '}
            <a
              href={`http://localhost:5000/${employee.contract_file}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                style={{
                  marginLeft: '10px',
                  padding: '6px 14px',
                  backgroundColor: '#2575fc',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                View Contract
              </button>
            </a>
          </div>
        ) : (
          <p><b>Offer Letter:</b> Not uploaded</p>
        )}

        {/* Note / Reminder */}
        <div
          style={{
            backgroundColor: '#fff8dc',
            padding: '10px',
            marginTop: '20px',
            borderRadius: '8px',
            border: '1px solid #ffe58f',
            fontSize: '14px',
            color: '#7c6b00',
          }}
        >
          <strong>📌 Note:</strong> Please ensure your contract is renewed before the expiry date.
          If your contract is expiring soon, contact the HR team for assistance.
        </div>
      </div>
    </div>
  );



      case 'projects':
        return (
          <div>
            <div className="header-row">
              <h2>My Projects</h2>
              <button className="back-btn" onClick={() => setActiveView('welcome')}>⬅ Back</button>
            </div>
            <div className="project-list">
              {employee.projects?.map((proj) => (
                <div key={proj._id} className="card">
                  <h4>{proj.name}</h4>
                  <p><b>Status:</b> {proj.status}</p>
                  <p><b>Description:</b> {proj.description}</p>
                  <p><b>Start:</b> {new Date(proj.start_date).toLocaleDateString()}</p>
                  <p><b>End:</b> {new Date(proj.end_date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'tasks':
        return (
          <div>
            <div className="header-row">
              <h2>My Tasks</h2>
              <button className="back-btn" onClick={() => setActiveView('welcome')}>⬅ Back</button>
            </div>
            {allTasks.length === 0 ? <p>No tasks assigned.</p> :
              allTasks.map((task) => (
                <div key={task._id} className="card">
                  <h4>{task.title}</h4>
                  <p><b>Status:</b> {task.status}</p>
                  <p><b>Priority:</b> {task.priority}</p>
                  <p><b>Deadline:</b> {new Date(task.deadline).toLocaleDateString()}</p>
                  <p><b>Project:</b> {task.projectName}</p>
                  <button className="action-btn" onClick={() => navigate('/employee/kanban')}>🚀 Start</button>
                </div>
              ))
            }
          </div>
        );
        
        case 'attendance':
  return (
    <div>
      <div className="header-row">
        <h2>📅 Attendance</h2>
        <button className="back-btn" onClick={() => setActiveView('welcome')}>
          ⬅ Back
        </button>
      </div>

      <div className="card">
        <p><strong>📈 Current Month Attendance:</strong> {monthlyPresent} / {workingDays} days</p>
      

        <div style={{ marginTop: '20px' }}>
          <button
            className="action-btn"
            onClick={markAttendance}
            disabled={attendanceMarked}
          >
            {attendanceMarked ? '✔ Present Marked' : '📍 Mark Present'}
          </button>

          <button
            className="action-btn"
            style={{ marginLeft: '10px' }}
            onClick={() => setShowLeaveForm(!showLeaveForm)}
          >
            📝 Apply for Leave
          </button>
        </div>

        {showLeaveForm && (
          <div className="leave-form" style={{ marginTop: '20px' }}>
            <h4>Leave Request</h4>

            <input
              type="date"
              value={leaveDate}
              onChange={(e) => setLeaveDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              max={new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0]}
            />

            <input
              type="text"
              placeholder="Reason for leave"
              value={leaveReason}
              onChange={(e) => setLeaveReason(e.target.value)}
              required
            />

            <button
              className="action-btn"
              onClick={submitLeave}
              style={{ marginTop: '10px' }}
            >
              ✅ Submit Leave
            </button>
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3>📜 My Leave History</h3>
        {leaveHistory.length === 0 ? (
          <p>No leave records found.</p>
        ) : (
          <table className="project-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveHistory.map((leave, idx) => (
                <tr key={idx}>
                  <td>{new Date(leave.date).toLocaleDateString()}</td>
                  <td>{leave.reason}</td>
                  <td>
                    <span className={`status-badge ${leave.status.toLowerCase()}`}>
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

      case 'sessionHistory':
        const filtered = filterDate
          ? sessions.filter(s => new Date(s.loginTime).toISOString().split('T')[0] === filterDate)
          : sessions;

        const grouped = filtered.reduce((acc, s) => {
          const dateKey = new Date(s.loginTime).toISOString().split('T')[0];
          if (!acc[dateKey]) acc[dateKey] = [];
          acc[dateKey].push(s);
          return acc;
        }, {});

        return (
          <div>
            <div className="header-row">
              <h2>Login Session History</h2>
              <button className="back-btn" onClick={() => setActiveView('welcome')}>⬅ Back</button>
            </div>
            <div className="filter-bar">
              <div className="export-buttons">
  <button className="action-btn" onClick={handleExportPDF}>📄 Export PDF</button>
  <button className="action-btn" onClick={handleExportExcel}>📊 Export Excel</button>
</div>

              <label>Filter by Date:</label>
              <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
              {filterDate && <button className="action-btn" onClick={() => setFilterDate('')}>Clear</button>}
            </div>
            {Object.keys(grouped).length === 0 ? <p>No session history found.</p> :
              Object.entries(grouped).map(([date, logs]) => {
                let total = 0;
                logs.forEach(s => {
                  const login = new Date(s.loginTime);
                  const logout = s.logoutTime ? new Date(s.logoutTime) : new Date();
                  total += logout - login;
                });

                return (
                  <div key={date} className="card session-card">
                    <h4>{new Date(date).toDateString()}</h4>
                    <p><b>Total Time:</b> {formatDuration(total)}</p>
                    <table className="session-table">
                      <thead>
                        <tr>
                          <th>Login Time</th>
                          <th>Logout Time</th>
                          <th>Duration</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.map(log => {
                          const loginTime = new Date(log.loginTime);
                          const logoutTime = log.logoutTime ? new Date(log.logoutTime) : null;
                          const duration = logoutTime ? (logoutTime - loginTime) : (new Date() - loginTime);
                          return (
                            <tr key={log._id}>
                              <td>{loginTime.toLocaleTimeString()}</td>
                              <td>{logoutTime ? logoutTime.toLocaleTimeString() : 'Active'}</td>
                              <td>{formatDuration(duration)}</td>
                              <td>{logoutTime ? 'Completed' : 'Active'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })}
          </div>
        );
        
        case 'team':
  return (
    <div className="team-view">
      <div className="header-row">
        <h2>👥 My Team</h2>
        <button className="back-btn" onClick={() => setActiveView('welcome')}>
          ⬅ Back
        </button>
      </div>

      {teamLoading ? (
        <div className="card"><p>Loading team data...</p></div>
      ) : teamMembers.length === 0 ? (
        <div className="card"><p>No team members found on your projects.</p></div>
      ) : (
        <div className="team-grid">
          {teamMembers.map(member => (
            <div key={member._id} className="card team-card">
              <div className="team-header">
                <img src="/avatar.png" alt="Avatar" className="team-avatar" />
                <div>
                  <h3>{member.name}</h3>
                  <p className="team-role">{member.designation}</p>
                  <p className="team-email">{member.email}</p>
                </div>
              </div>

              <div className="team-projects">
                <strong>Projects:</strong>{' '}
                {member.projects.map(p => p.name).join(', ') || 'None'}
              </div>

              <div className="team-tasks">
                <strong>Tasks:</strong>
                {member.tasks.length === 0 ? (
                  <p><i>No tasks assigned</i></p>
                ) : (
                  <ul className="task-list">
                    {member.tasks.map(task => (
                      <li key={task._id}>
                        <b>{task.title}</b> — 
                        <span className={`status-badge ${task.status.toLowerCase()}`}>
                          {task.status}
                        </span><br />
                        <small>📅 {new Date(task.deadline).toLocaleDateString()} | 📁 {task.projectName}</small>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );



    case 'taskHistory': {
 

  const filteredTasks = taskHistory.filter(task => {
    return (
      (!statusFilter || task.status === statusFilter) &&
      (!projectFilter || task.project?.name === projectFilter)
    );
  });

  const uniqueProjects = [...new Set(taskHistory.map(t => t.project?.name).filter(Boolean))];

  const totalWorkedMs = filteredTasks.reduce(
    (acc, t) => acc + (t.actualWorkedTimeInSeconds || t.totalWorkedTimeInSeconds || 0),
    0
  ) * 1000;

  const totalEstimatedMs = filteredTasks.reduce(
    (acc, t) => acc + (t.estimatedTimeInSeconds || 0),
    0
  ) * 1000;

  const totalRemainingMs = filteredTasks.reduce(
    (acc, t) => acc + (t.remainingTimeInSeconds || 0),
    0
  ) * 1000;

  const handleTaskHistoryPDFExport = () => {
  const doc = new jsPDF();
  const employeeName = employee?.name || 'Employee';

  // Define the rows FIRST
  const rows = filteredTasks.map(t => [
    t.title,
    t.project?.name || 'N/A',
    t.status,
    t.priority,
    formatDuration((t.actualWorkedTimeInSeconds || t.totalWorkedTimeInSeconds || 0) * 1000),
    formatDuration((t.estimatedTimeInSeconds || 0) * 1000),
    formatDuration((t.remainingTimeInSeconds || 0) * 1000),
    new Date(t.deadline).toLocaleDateString(),
  ]);

  // Set heading and info
  doc.setFontSize(16);
  doc.text('UnifiedOps - Task History Report', 14, 20);
  doc.setFontSize(11);
  doc.text(`Printed on: ${new Date().toLocaleString()}`, 14, 28);
  doc.text(`Employee: ${employeeName}`, 14, 34);
  doc.text('Note: This report is visible only to the employee.', 14, 40);

  // Call autoTable with the defined rows
  autoTable(doc, {
    head: [['Title', 'Project', 'Status', 'Priority', 'Worked', 'Estimated', 'Remaining', 'Deadline']],
    body: rows,
    startY: 45,
    styles: {
      fillColor: [230, 240, 255],
    },
    headStyles: {
      fillColor: [22, 160, 133], // teal
      textColor: 255,
    },
  });

  // Summary Section
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    body: [
      ['Total Tasks', filteredTasks.length],
      ['Total Estimated Time', formatDuration(totalEstimatedMs)],
      ['Total Worked Time', formatDuration(totalWorkedMs)],
      ['Total Remaining Time', formatDuration(totalRemainingMs)],
    ],
    styles: {
      fillColor: [255, 250, 205],
    }
  });

  doc.save('task_history_report.pdf');
};


  const handleTaskHistoryExcelExport = () => {
    const wb = XLSX.utils.book_new();
    const wsData = [
      ['Title', 'Project', 'Status', 'Priority', 'Worked', 'Estimated', 'Remaining', 'Deadline'],
      ...filteredTasks.map(t => [
        t.title,
        t.project?.name || 'N/A',
        t.status,
        t.priority,
        formatDuration((t.actualWorkedTimeInSeconds || t.totalWorkedTimeInSeconds || 0) * 1000),
        formatDuration((t.estimatedTimeInSeconds || 0) * 1000),
        formatDuration((t.remainingTimeInSeconds || 0) * 1000),
        new Date(t.deadline).toLocaleDateString(),
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Task History');
    XLSX.writeFile(wb, 'task_history_report.xlsx');
  };

  return (
    <div>
      <div className="header-row">
        <h2>Task History</h2>
        <button className="back-btn" onClick={() => setActiveView('welcome')}>⬅ Back</button>
      </div>

      <div className="filters">
        <label>Status:</label>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All</option>
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <label>Project:</label>
        <select value={projectFilter} onChange={e => setProjectFilter(e.target.value)}>
          <option value="">All</option>
          {uniqueProjects.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>

        <button className="export-btn" onClick={handleTaskHistoryPDFExport}>📄 Export PDF</button>
        <button className="export-btn" onClick={handleTaskHistoryExcelExport}>📊 Export Excel</button>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="card"><p><i>No tasks found.</i></p></div>
      ) : (
        <>
          {filteredTasks
            .sort((a, b) => new Date(b.deadline) - new Date(a.deadline))
            .map(task => (
              <div key={task._id} className="card">
                <h4>{task.title}</h4>
                <p><b>Project:</b> {task.project?.name || 'N/A'}</p>
                <p><b>Deadline:</b> {new Date(task.deadline).toLocaleDateString()}</p>
                <p><b>Status:</b>
                  <span className={`status-badge ${task.status.toLowerCase()}`}>{task.status}</span>
                </p>
                <p><b>Priority:</b> {task.priority}</p>
                <p><b>Estimated Time:</b> {formatDuration((task.estimatedTimeInSeconds || 0) * 1000)}</p>
                <p><b>Worked Time:</b> {formatDuration((task.actualWorkedTimeInSeconds || task.totalWorkedTimeInSeconds || 0) * 1000)}</p>
                <p><b>Remaining Time:</b> {formatDuration((task.remainingTimeInSeconds || 0) * 1000)}</p>
                <p><b>Description:</b> {task.description || '—'}</p>
              </div>
            ))}

          <div className="card summary-card">
            <h4>📊 Summary</h4>
            <p><b>Total Tasks:</b> {filteredTasks.length}</p>
            <p><b>Total Estimated Time:</b> {formatDuration(totalEstimatedMs)}</p>
            <p><b>Total Worked Time:</b> {formatDuration(totalWorkedMs)}</p>
            <p><b>Total Remaining Time:</b> {formatDuration(totalRemainingMs)}</p>
          </div>
        </>
      )}
    </div>
  );
  
}


      default:
        return <div>Invalid View</div>;
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">UnifiedOps</div>
        <button className="nav-btn" onClick={() => setActiveView('welcome')}><FiHome /> Welcome</button>
        <button className="nav-btn" onClick={() => setActiveView('info')}><FiUser /> My Info</button>
          <button className="nav-btn" onClick={() => setActiveView('team')}><FiUsers/>My Team</button>
        <button className="nav-btn" onClick={() => setActiveView('projects')}><FiFolder /> Projects</button>
        <button className="nav-btn" onClick={() => setActiveView('tasks')}><FiCheckSquare /> Tasks</button>
        <button className="nav-btn" onClick={() => setActiveView('attendance')}><FiCalendar /> Attendance</button>
        <button className="nav-btn" onClick={() => setActiveView('sessionHistory')}><FiClock /> Sessions</button>
        <button className="nav-btn" onClick={() => setActiveView('taskHistory')}><FiList /> Task History</button>
       <button
  className="nav-btn"
  onClick={() => setActiveView('notifications')}
  style={{ position: 'relative', width: '100%', textAlign: 'left' }}
>
  <FiBell style={{ marginRight: 8 }} /> Notifications
  {unreadCount > 0 && (
    <span style={{
      position: 'absolute',
      top: 8,
      right: 16,
      background: 'red',
      color: 'white',
      borderRadius: '50%',
      padding: '2px 6px',
      fontSize: '12px',
      fontWeight: 'bold',
    }}>
      {unreadCount}
    </span>
  )}
</button>
<button className="nav-btn"  onClick={() => navigate('/reset-password')}><FiKey/>
  
  Reset Password
  
</button>





        <button className="logout-btn" onClick={logoutAndRedirect}><FiLogOut /> Logout</button>
      </aside>
      <main className="main-content">{renderContent()}</main>
    </div>
  );
};

export default EmployeeDashboard;
