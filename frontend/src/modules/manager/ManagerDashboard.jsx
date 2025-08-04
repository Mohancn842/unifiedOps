import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ManagerDashboard.css';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import {
  fetchAllEmployeesWithProjects,
  fetchEmployeesWithTasks,
} from '../../services/employeeService';
import { fetchTasks } from '../../services/taskService';
const baseURL = process.env.REACT_APP_API_BASE_URL;

const ManagerDashboard = () => {
  const navigate = useNavigate();

  // Section Refs
  const employeeRef = useRef(null);
  const projectRef = useRef(null);
  const taskRef = useRef(null);
  const reportRef = useRef(null);


  // Scroll to Section
  const scrollToSection = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    sessionStorage.setItem('loggedOut', 'true');
    navigate('/manager/login', { replace: true });
  }, [navigate]);

  // State
  const [activeTab, setActiveTab] = useState('employees');
  const [trackingTab, setTrackingTab] = useState('session');
  const [employees, setEmployees] = useState([]);
  const [employeesWithTasks, setEmployeesWithTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [projectSearch, setProjectSearch] = useState('');
  const [projectStatusFilter, setProjectStatusFilter] = useState('');
  const [taskSearch, setTaskSearch] = useState('');
  const [taskProjectFilter, setTaskProjectFilter] = useState('');
  const [taskStatusFilter, setTaskStatusFilter] = useState('');
const [teamChartsByProject, setTeamChartsByProject] = useState({});
const [expandedProjectId, setExpandedProjectId] = useState(null);
const [sessions, setSessions] = useState([]);
const [sessionSearch, setSessionSearch] = useState('');
const [sessionStartDate, setSessionStartDate] = useState('');
const [sessionEndDate, setSessionEndDate] = useState('');

useEffect(() => {
 axios.get(`${baseURL}/api/sessions`)
    .then((res) => {
      console.log("Fetched sessions:", res.data);
      setSessions(res.data);
    })
    .catch((err) => console.error('Failed to fetch sessions:', err));
}, []);


const exportPDFStyled = (rows, columns, title, fileName) => {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'A4',
  });

  // Title
  doc.setFontSize(18);
  doc.setTextColor('#2e2e2e');
  doc.text(title, 40, 40);

  // Printed Date and Printed By
  const dateStr = new Date().toLocaleString('en-IN');
  doc.setFontSize(10);
  doc.setTextColor('#555');
  doc.text(`Printed on: ${dateStr}`, 40, 60);
  doc.text(`Printed by: Manager`, 40, 75);

  // Horizontal line
  doc.setLineWidth(0.5);
  doc.setDrawColor('#aaa');
  doc.line(40, 85, doc.internal.pageSize.width - 40, 85);

  // Format salary column if exists
  const salaryColIndex = columns.findIndex(col => col.toLowerCase().includes('salary'));
  const coloredRows = rows.map((row) => {
    const updated = [...row];
    if (salaryColIndex !== -1 && updated[salaryColIndex]) {
      const rawSalary = updated[salaryColIndex].toString().replace(/[^0-9]/g, '');
      updated[salaryColIndex] = Number(rawSalary).toLocaleString('en-IN', { maximumFractionDigits: 0 });
    }
    return updated;
  });

  // Table
  autoTable(doc, {
    startY: 95,
    head: [columns],
    body: coloredRows,
    styles: {
      fontSize: 10,
      cellPadding: 6,
      textColor: '#333',
      lineColor: '#ccc',
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: [63, 81, 181],
      textColor: '#fff',
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: '#f9f9f9',
    },
    margin: { left: 40, right: 40 },
  });

  // Watermark
  const watermark = 'UNIFIEDOPS';
  doc.setFontSize(48);
  doc.setTextColor(230, 230, 230);
  doc.text(watermark, doc.internal.pageSize.width / 2, doc.internal.pageSize.height / 2, {
    align: 'center',
    angle: 45,
  });

  doc.save(fileName);
};
const exportExcel = (rows, columns, fileName) => {
  const ws = XLSX.utils.aoa_to_sheet([columns, ...rows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `${fileName}.xlsx`);
};

  useEffect(() => {
    const token = localStorage.getItem('token');
    const loggedOut = sessionStorage.getItem('loggedOut');
    if (!token || loggedOut === 'true') {
      sessionStorage.removeItem('loggedOut');
      navigate('/manager/login', { replace: true });
      return;
    }
    // ================= Export Helpers =================

// Utility Export Function

    const handlePopState = () => logout();
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate, logout]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const empData = await fetchAllEmployeesWithProjects();
        const taskData = await fetchEmployeesWithTasks();
        const projData = await axios.get(`${baseURL}/api/projects`);
        const taskList = await fetchTasks();
        setEmployees(empData);
        setEmployeesWithTasks(taskData);
        setProjects(projData.data);
        setTasks(taskList);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };
    loadData();
  }, []);

const formatSessionDuration = (start, end) => {
  if (!end) return '-';
  const ms = new Date(end) - new Date(start);
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  return `${hours}h ${minutes}m`;
};
const formatTaskDuration = (seconds) => {
  if (!seconds || seconds <= 0) return '-';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hrs}h ${mins}m`;
};
const handleAddToProject = async (projectId, employeeId) => {
  if (!employeeId) return;

  try {
    await axios.post(`${baseURL}/api/projects/${projectId}/add-member`, {
      employeeId,
    });

    // 🔄 Refresh project & employee data after update
    const [empData, projData] = await Promise.all([
      fetchAllEmployeesWithProjects(),
     axios.get(`${baseURL}/api/projects`),
    ]);
    setEmployees(empData);
    setProjects(projData.data);
  } catch (err) {
    console.error('❌ Failed to add employee to project:', err);
  }
};const handleViewTeamPerformance = async (projectId) => {
  try {
    if (expandedProjectId === projectId) {
      setExpandedProjectId(null); // toggle off
      return;
    }

    setExpandedProjectId(projectId);

    // ✅ Step 1: Fetch employees with tasks
    const { data: employeesWithTasks } = await axios.get(
     `${baseURL}/api/employees/with-tasks`
    );

    console.log("🚀 All employees with tasks:", employeesWithTasks);
    console.log("📌 Selected projectId:", projectId);

    // 🔍 Step 2: Debug project IDs inside employee tasks
    employeesWithTasks.forEach(emp => {
      const projectIds = emp.tasks.map(t =>
        typeof t.project === 'object' ? t.project?._id : t.project
      );
      console.log(`👤 ${emp.name} → Task Projects:`, projectIds);
    });

    // ✅ Step 3: Filter employees with at least one task in this project
    const teamMembers = employeesWithTasks.filter(emp =>
      emp.tasks?.some(task => {
        const taskProjectId = typeof task.project === 'object' ? task.project?._id : task.project;
        return String(taskProjectId) === String(projectId);
      })
    );

    console.log("👥 Matched team members for project:", teamMembers.map(e => e.name));

    // ✅ Step 4: Fetch performance data for matched team
    const performanceData = await Promise.all(
      teamMembers.map(async (emp) => {
        try {
          const { data: perf } = await axios.get(
          `/api/employees/${emp._id}/performance`
          );
          console.log(`📊 Performance for ${emp.name}:`, perf);
          return {
            _id: emp._id,
            name: emp.name,
            email: emp.email,
            designation: emp.designation,
            ...perf
          };
        } catch (err) {
          console.error(`❌ Error fetching performance for ${emp.name}:`, err.response?.data || err.message);
          return null;
        }
      })
    );

    const filteredData = performanceData.filter(Boolean); // remove failed fetches

    console.log('✅ Final Team Performance Data:', filteredData);

    // ✅ Step 5: Store performance by project
    setTeamChartsByProject(prev => ({
      ...prev,
      [projectId]: filteredData
    }));
  } catch (err) {
    console.error('❌ Error fetching team performance:', err);
  }
};

  const filterEmployees = (list) =>
    list.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchText.toLowerCase()) ||
        emp.designation.toLowerCase().includes(searchText.toLowerCase());
      const matchesDept = filterDept === '' || emp.department === filterDept;
      return matchesSearch && matchesDept;
    });

  const filteredProjects = projects.filter((proj) =>
    proj.name.toLowerCase().includes(projectSearch.toLowerCase()) &&
    (projectStatusFilter === '' || proj.status === projectStatusFilter)
  );

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(taskSearch.toLowerCase()) &&
    (taskProjectFilter === '' || task.project?.name === taskProjectFilter) &&
    (taskStatusFilter === '' || task.status === taskStatusFilter)
  );

  const uniqueDepartments = [
    ...new Set([
      ...employees.map((emp) => emp.department),
      ...employeesWithTasks.map((emp) => emp.department),
    ]),
  ];

  return (
    <div className="manager-container">
      <aside className="sidebar">
        <h2 className="logo">Unified Ops</h2>
        <ul>
          <li onClick={() => scrollToSection(employeeRef)}>👥 Employee Management</li>
          <li onClick={() => scrollToSection(projectRef)}>📁 Project Management</li>
          <li onClick={() => scrollToSection(taskRef)}>📝 Task Management</li>
          <li onClick={() => scrollToSection(reportRef)}>📊 Reports</li>
        </ul>
      </aside>

      <main className="dashboard-content">
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Manager Dashboard</h1>
            <div className="quick-actions">
              <button onClick={() => navigate('/manager/add-employee')}>➕ Add Employee</button>
              <button onClick={() => navigate('/manager/addproject')}>➕ Add Project</button>
              <button onClick={() => navigate('/manager/task')}>📝 Assign Task</button>
            </div>
          </div>
          <div className="header-right">
            <button className="logout-btn" onClick={logout}>🔴 Logout</button>
          </div>
        </header>

        {/* Employee Section */}
        <section className="employee-management" ref={employeeRef}>
  <h2>Employee Management</h2>
  <div className="tabs">
    <button className={activeTab === 'employees' ? 'active' : ''} onClick={() => setActiveTab('employees')}>
      Employee List
    </button>
    <button className={activeTab === 'assignments' ? 'active' : ''} onClick={() => setActiveTab('assignments')}>
      Employee with Task and Project
    </button>
  </div>

  <div className="employee-filters">
    <input
      type="text"
      placeholder="Search by name or designation"
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
    />
    <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
      <option value="">All Departments</option>
      {uniqueDepartments.map((dept, i) => (
        <option key={i} value={dept}>{dept}</option>
      ))}
    </select>
  </div>

  {activeTab === 'employees' && (
    <>
      <div className="export-buttons">
        <button onClick={() => {
          const cols = ['Name', 'Email', 'Department', 'Designation', 'Salary', 'Join Date', 'Contract Expiry'];
          const rows = filterEmployees(employees).map(emp => [
            emp.name, emp.email, emp.department, emp.designation,
            `₹${Number(emp.salary).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,


            emp.join_date?.split('T')[0] || '',
            emp.contract_expiry?.split('T')[0] || ''
          ]);
          exportPDFStyled(rows, cols, 'UnifiedOps - Employee List', 'Employee_List.pdf');
        }}>📄 Export PDF</button>

        <button onClick={() => {
          const cols = ['Name', 'Email', 'Department', 'Designation', 'Salary', 'Join Date', 'Contract Expiry'];
          const rows = filterEmployees(employees).map(emp => [
            emp.name, emp.email, emp.department, emp.designation,
          `${Number(emp.salary).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,

            emp.join_date?.split('T')[0] || '',
            emp.contract_expiry?.split('T')[0] || ''
          ]);
          exportExcel(rows, cols, 'Employee_List');
        }}>📊 Export Excel</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Salary</th>
            <th>Join Date</th>
            <th>Contract Expiry</th>
            <th>Contract File</th>
          </tr>
        </thead>
        <tbody>
          {filterEmployees(employees).map((emp) => (
            <tr key={emp._id}>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.department}</td>
              <td>{emp.designation}</td>
              <td>₹{Number(emp.salary).toLocaleString()}</td>
              <td>{emp.join_date?.split('T')[0]}</td>
              <td>{emp.contract_expiry?.split('T')[0]}</td>
              <td>
                {emp.contract_file ? (
                 <a
  href={`${baseURL}/uploads/contracts/${emp.contract_file}`}
  target="_blank"
  rel="noreferrer"
  className="link"
>
  View
</a>

                ) : (<em style={{ color: '#999' }}>None</em>)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )}

  {activeTab === 'assignments' && (
    <>
      <div className="export-buttons">
        <button onClick={() => {
          const cols = ['Name', 'Email', 'Department', 'Designation', 'Projects', 'Tasks'];
          const rows = filterEmployees(employeesWithTasks).map(emp => [
            emp.name,
            emp.email,
            emp.department,
            emp.designation,
            (emp.projects || []).map(p => `${p.name} (${p.status})`).join(', '),
            (emp.tasks || []).map(t => `${t.title} (${t.status})`).join(', ')
          ]);
          exportPDFStyled(rows, cols, 'UnifiedOps – Employee Task & Project Overview', 'Employee_Task_Project');
        }}>📄 Export PDF</button>

        <button onClick={() => {
          const cols = ['Name', 'Email', 'Department', 'Designation', 'Projects', 'Tasks'];
          const rows = filterEmployees(employeesWithTasks).map(emp => [
            emp.name,
            emp.email,
            emp.department,
            emp.designation,
            (emp.projects || []).map(p => `${p.name} (${p.status})`).join(', '),
            (emp.tasks || []).map(t => `${t.title} (${t.status})`).join(', ')
          ]);
          exportExcel(rows, cols, 'Employee_Task_Project');
        }}>📊 Export Excel</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Projects</th>
            <th>Tasks</th>
          </tr>
        </thead>
        <tbody>
          {filterEmployees(employeesWithTasks).map((emp) => (
            <tr key={emp._id}>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.department}</td>
              <td>{emp.designation}</td>
              <td>
                <ul className="list">
                  {(emp.projects || []).map((proj) => (
                    <li key={proj._id}>📁 {proj.name} ({proj.status})</li>
                  ))}
                </ul>
              </td>
              <td>
                <ul className="list">
                  {(emp.tasks || []).map((task) => (
                    <li key={task._id}>📝 {task.title} – <span style={{ color: '#007bff' }}>{task.status}</span></li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )}
</section>


        {/* Project Section */}
       <section className="project-management" ref={projectRef}>
  <h2>Project Management</h2>

  {/* Export Buttons */}
  <div className="export-buttons">
    <button onClick={() => {
      const cols = ['#', 'Name', 'Start', 'End', 'Status'];
      const rows = filteredProjects.map((p, i) => [
        i + 1,
        p.name,
        p.start_date?.split('T')[0] || '',
        p.end_date?.split('T')[0] || '',
        p.status
      ]);
      exportPDFStyled(rows, cols, 'UnifiedOps - Project List', 'Project_List.pdf');
    }}>Export PDF</button>

    <button onClick={() => {
      const cols = ['#', 'Name', 'Start', 'End', 'Status'];
      const rows = filteredProjects.map((p, i) => [
        i + 1,
        p.name,
        p.start_date?.split('T')[0] || '',
        p.end_date?.split('T')[0] || '',
        p.status
      ]);
      exportExcel(rows, cols, 'Project_List');
    }}>Export Excel</button>
  </div>

  {/* Filters */}
  <div className="filters">
    <input
      type="text"
      placeholder="Search by Project Name"
      value={projectSearch}
      onChange={(e) => setProjectSearch(e.target.value)}
    />
    <select
      value={projectStatusFilter}
      onChange={(e) => setProjectStatusFilter(e.target.value)}
    >
      <option value="">All Status</option>
      <option value="Planned">Planned</option>
      <option value="In Progress">In Progress</option>
      <option value="Completed">Completed</option>
    </select>
  </div>

  {/* Table: Project List */}
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Start</th>
        <th>End</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {filteredProjects.map((proj, i) => (
        <tr key={proj._id}>
          <td>{i + 1}</td>
          <td>{proj.name}</td>
          <td>{proj.start_date?.split('T')[0]}</td>
          <td>{proj.end_date?.split('T')[0]}</td>
          <td>{proj.status}</td>
        </tr>
      ))}
    </tbody>
  </table>
{/* 👥 Team Management Table */}
<div style={{ marginTop: '2rem' }}>
  <h3>👥 Team Management</h3>
  <table>
    <thead>
      <tr>
        <th>Project</th>
        <th>Assigned Employees</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {projects.map((proj) => (
        <React.Fragment key={proj._id}>
          <tr>
            <td>{proj.name}</td>
            <td>
              <ul style={{ paddingLeft: 20 }}>
                {employees
                  .filter(emp => emp.projects?.includes(proj._id))
                  .map(emp => (
                    <li key={emp._id}>{emp.name}</li>
                  ))}
              </ul>
            </td>
            <td>
              <select
                className="add-member-select"
                defaultValue=""
                onChange={(e) => handleAddToProject(proj._id, e.target.value)}
              >
                <option value="" disabled>➕ Add Member</option>
                {employees
                  .filter(emp => !emp.projects?.includes(proj._id))
                  .map(emp => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name}
                    </option>
                  ))}
              </select>

              <button
                className="team-performance-btn"
                style={{ marginTop: 10, display: 'block' }}
                onClick={() => handleViewTeamPerformance(proj._id)}
              >
                📊 View Performance
              </button>
            </td>
          </tr>

          {/* 🔽 Conditional row for team performance graph */}
          {expandedProjectId === proj._id && (
            <tr>
              <td colSpan="3">
                <div style={{ marginTop: '1rem' }}>
                  <h4>📈 Performance Charts for {proj.name}</h4>

                  {!teamChartsByProject[proj._id]?.length ? (
                    <p style={{ color: '#888', fontStyle: 'italic' }}>
                      No team members with performance data for this project.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
                      {teamChartsByProject[proj._id].map(emp => (
                        <div
                          key={emp._id}
                          style={{
                            width: '300px',
                            background: '#f9fafb',
                            padding: '16px',
                            borderRadius: '10px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
                          }}
                        >
                          <h4 style={{ marginBottom: '8px' }}>
                            {emp.name}{' '}
                            <span style={{ fontSize: '12px', color: '#666' }}>
                              ({emp.designation})
                            </span>
                          </h4>
                          <ResponsiveContainer width="100%" height={200}>
                            <BarChart
                              data={[{
                                name: 'Tasks',
                                Completed: emp.completedTasks || 0,
                                InProgress: emp.inProgressTasks || 0,
                                Pending: emp.pendingTasks || 0,
                              }]}
                            >
                              <XAxis dataKey="name" />
                              <YAxis allowDecimals={false} />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="Completed" fill="#10b981" />
                              <Bar dataKey="InProgress" fill="#3b82f6" />
                              <Bar dataKey="Pending" fill="#f59e0b" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </td>
            </tr>
          )}
        </React.Fragment>
      ))}
    </tbody>
  </table>
</div>
</section>


        {/* Task Section */}
        <section className="task-management" ref={taskRef}>
          <h2>Task Management</h2>
          <div className="export-buttons">
  <button onClick={() => {
    const cols = ['Title', 'Assignee', 'Project', 'Priority', 'Est. Hours', 'Deadline', 'Status'];
    const rows = filteredTasks.map((t) => [
      t.title,
      t.assignee?.name || 'N/A',
      t.project?.name || 'N/A',
      t.priority,
      t.estimated_hours,
      t.deadline?.split('T')[0] || '',
      t.status
    ]);
    exportPDFStyled(rows, cols, 'UnifiedOps - Task List', 'Task_List.pdf');
  }}>Export PDF</button>

  <button onClick={() => {
    const cols = ['Title', 'Assignee', 'Project', 'Priority', 'Est. Hours', 'Deadline', 'Status'];
    const rows = filteredTasks.map((t) => [
      t.title,
      t.assignee?.name || 'N/A',
      t.project?.name || 'N/A',
      t.priority,
      t.estimated_hours,
      t.deadline?.split('T')[0] || '',
      t.status
    ]);
    exportExcel(rows, cols, 'Task_List');
  }}>Export Excel</button>
</div>

          <div className="filters">
            <input type="text" placeholder="Search Task Title" value={taskSearch} onChange={(e) => setTaskSearch(e.target.value)} />
            <select value={taskProjectFilter} onChange={(e) => setTaskProjectFilter(e.target.value)}>
              <option value="">All Projects</option>
              {[...new Set(tasks.map((t) => t.project?.name))].map((name, i) => (
                <option key={i} value={name}>{name}</option>
              ))}
            </select>
            <select value={taskStatusFilter} onChange={(e) => setTaskStatusFilter(e.target.value)}>
              <option value="">All Status</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <table className="task-table">
            <thead>
              <tr>
                <th> Title</th>
                <th> Assignee</th>
                <th> Project</th>
                <th> Priority</th>
                <th> Est. Hours</th>
                <th> Deadline</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>{task.assignee?.name}</td>
                  <td>{task.project?.name}</td>
                  <td>{task.priority}</td>
                  <td>{task.estimated_hours}</td>
                  <td>{task.deadline?.split('T')[0]}</td>
                  <td>{task.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Reports Section */}
       <section className="tracking" ref={reportRef}>
  <h2>Reports</h2>
  <div className="tabs">
    <button
      className={trackingTab === 'session' ? 'active' : ''}
      onClick={() => setTrackingTab('session')}
    >
      Employee Session
    </button>
    <button
      className={trackingTab === 'hours' ? 'active' : ''}
      onClick={() => setTrackingTab('hours')}
    >
      Task Working Hours
    </button>
  </div>

  {/* Employee Session Report */}
  {trackingTab === 'session' && (
    <><div className="export-buttons">
  <button onClick={() => {
    const cols = ['Employee', 'Session Start', 'Session End', 'Duration'];
    const rows = sessions.filter((s) => {
      const login = new Date(s.loginTime);
      const afterStart = !sessionStartDate || login >= new Date(sessionStartDate);
      const beforeEnd = !sessionEndDate || login <= new Date(sessionEndDate + 'T23:59:59');
      return s.employee?.name?.toLowerCase().includes(sessionSearch.toLowerCase()) && afterStart && beforeEnd;
    }).map((s) => [
      s.employee?.name || 'N/A',
      new Date(s.loginTime).toLocaleString(),
      s.logoutTime ? new Date(s.logoutTime).toLocaleString() : '-',
      formatSessionDuration(s.loginTime, s.logoutTime)
    ]);
    exportPDFStyled(rows, cols, 'UnifiedOps - Employee Session Report', 'Session_Report.pdf');
  }}>Export PDF</button>

  <button onClick={() => {
    const cols = ['Employee', 'Session Start', 'Session End', 'Duration'];
    const rows = sessions.filter((s) => {
      const login = new Date(s.loginTime);
      const afterStart = !sessionStartDate || login >= new Date(sessionStartDate);
      const beforeEnd = !sessionEndDate || login <= new Date(sessionEndDate + 'T23:59:59');
      return s.employee?.name?.toLowerCase().includes(sessionSearch.toLowerCase()) && afterStart && beforeEnd;
    }).map((s) => [
      s.employee?.name || 'N/A',
      new Date(s.loginTime).toLocaleString(),
      s.logoutTime ? new Date(s.logoutTime).toLocaleString() : '-',
      formatSessionDuration(s.loginTime, s.logoutTime)
    ]);
    exportExcel(rows, cols, 'Session_Report');
  }}>Export Excel</button>
</div>

      <div className="session-filters">
        <input
          type="text"
          placeholder="Search by Employee Name"
          value={sessionSearch}
          onChange={(e) => setSessionSearch(e.target.value)}
        />
        <input
          type="date"
          value={sessionStartDate}
          onChange={(e) => setSessionStartDate(e.target.value)}
        />
        <input
          type="date"
          value={sessionEndDate}
          onChange={(e) => setSessionEndDate(e.target.value)}
        />
      </div>

      {sessions.length === 0 ? (
        <p style={{ padding: '1rem' }}>No session data available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Session Start</th>
              <th>Session End</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {sessions
              .filter((s) => {
                const nameMatch = s.employee?.name
                  ?.toLowerCase()
                  .includes(sessionSearch.toLowerCase());
                const login = new Date(s.loginTime);
                const afterStart =
                  !sessionStartDate || login >= new Date(sessionStartDate);
                const beforeEnd =
                  !sessionEndDate ||
                  login <= new Date(sessionEndDate + 'T23:59:59');
                return nameMatch && afterStart && beforeEnd;
              })
              .map((s, idx) => (
                <tr key={idx}>
                  <td>{s.employee?.name || 'N/A'}</td>
                  <td>{new Date(s.loginTime).toLocaleString()}</td>
                  <td>
                    {s.logoutTime
                      ? new Date(s.logoutTime).toLocaleString()
                      : '-'}
                  </td>
                  <td>{formatSessionDuration(s.loginTime, s.logoutTime)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </>
  )}

  {/* Task Working Hours Report */}
  {trackingTab === 'hours' && (
    <><div className="export-buttons">
  <button onClick={() => {
    const cols = ['Task Title', 'Assignee', 'Project', 'Status', 'Estimated Hours', 'Total Worked Time'];
    const rows = filteredTasks.map((t) => [
      t.title,
      t.assignee?.name || 'N/A',
      t.project?.name || 'N/A',
      t.status,
      t.estimated_hours,
      formatTaskDuration(t.totalWorkedTimeInSeconds)
    ]);
    exportPDFStyled(rows, cols, 'UnifiedOps - Task Hours Report', 'Task_Hours_Report.pdf');
  }}>Export PDF</button>

  <button onClick={() => {
    const cols = ['Task Title', 'Assignee', 'Project', 'Status', 'Estimated Hours', 'Total Worked Time'];
    const rows = filteredTasks.map((t) => [
      t.title,
      t.assignee?.name || 'N/A',
      t.project?.name || 'N/A',
      t.status,
      t.estimated_hours,
      formatTaskDuration(t.totalWorkedTimeInSeconds)
    ]);
    exportExcel(rows, cols, 'Task_Hours_Report');
  }}>Export Excel</button>
</div>

      <div className="task-hours-filters">
        <input
          type="text"
          placeholder="Search Task Title"
          value={taskSearch}
          onChange={(e) => setTaskSearch(e.target.value)}
        />
        <select
          value={taskProjectFilter}
          onChange={(e) => setTaskProjectFilter(e.target.value)}
        >
          <option value="">All Projects</option>
          {[...new Set(tasks.map((t) => t.project?.name))].map((name, i) => (
            <option key={i} value={name}>
              {name}
            </option>
          ))}
        </select>
        <select
          value={taskStatusFilter}
          onChange={(e) => setTaskStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {filteredTasks.length === 0 ? (
        <p style={{ padding: '1rem' }}>No task data available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Task Title</th>
              <th>Assignee</th>
              <th>Project</th>
              <th>Status</th>
              <th>Estimated Hours</th>
              <th>Total Worked Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task, idx) => (
              <tr key={idx}>
                <td>{task.title}</td>
                <td>{task.assignee?.name || 'N/A'}</td>
                <td>{task.project?.name || 'N/A'}</td>
                <td>{task.status}</td>
                <td>{task.estimated_hours}h</td>
                <td>{formatTaskDuration(task.totalWorkedTimeInSeconds)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )}
</section>


      </main>
    </div>
  );
};

export default ManagerDashboard;



