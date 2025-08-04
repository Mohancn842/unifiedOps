import React, { useState, useEffect, useRef } from 'react';

import './HRDashboard.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

const baseURL = process.env.REACT_APP_API_BASE_URL;
const HRDashboard = () => {
  const [activeTab, setActiveTab] = useState('employees');
  const [searchText, setSearchText] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  const performanceRef = useRef(null);
  const [highlighted, setHighlighted] = useState(false);
const [allEmployees, setAllEmployees] = useState([]);
const [paidEmployees, setPaidEmployees] = useState([]);
const [selectedEmployees, setSelectedEmployees] = useState([]);
const [isLoading, setIsLoading] = useState(false);

const currentMonth = new Date().toISOString().slice(0, 7); // Format: 'YYYY-MM'
const [payrollHistory, setPayrollHistory] = useState([]);
const [showHistory, setShowHistory] = useState(false);
const [jobs, setJobs] = useState([]);
const [filteredJobs, setFilteredJobs] = useState([]);
const [search, setSearch] = useState('');
const [activeTabFilter, setActiveTabFilter] = useState('all');
const [showAddForm, setShowAddForm] = useState(false);
const [newJob, setNewJob] = useState({
  title: '',
  department: '',
  location: '',
  status: 'open',
  experience: ''
});
const [barData, setBarData] = useState([]);

const [attendanceRecords, setAttendanceRecords] = useState([]);
const [attendanceDate, setAttendanceDate] = useState('');
const [performanceStats, setPerformanceStats] = useState(null);
const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);


// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
  if (performanceStats?.monthly) {
    const formatted = Object.entries(performanceStats.monthly).map(([month, count]) => ({
      name: month,
      tasks: count,
    }));
    setBarData(formatted);
  } else {
    setBarData([]);
  }
}, [performanceStats]);


  const handleViewPerformance = (empId) => {
    setSelectedEmployeeId(empId);
    setTimeout(() => {
      if (performanceRef.current) {
        performanceRef.current.scrollIntoView({ behavior: 'smooth' });
        setHighlighted(true);
        setTimeout(() => setHighlighted(false), 2000);
      }
    }, 150);
  };


useEffect(() => {
  console.log('Selected Employee ID:', selectedEmployeeId); // ⬅️ TEMP LOG

  const fetchPerformance = async () => {
    if (!selectedEmployeeId) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/employees/${selectedEmployeeId}/performance`);
      if (!res.ok) throw new Error('Bad response from server');
      const data = await res.json();
      setPerformanceStats(data);
    } catch (err) {
      console.error('Error loading performance', err);
    }
  };

  if (activeTab === 'payroll') fetchPerformance();
}, [activeTab, selectedEmployeeId]);


const handleViewPayrollHistory = async () => {
  if (!showHistory) {
    try {
     const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/payroll/history`);
      setPayrollHistory(res.data);
    } catch (err) {
      console.error('Error fetching payroll history:', err);
      alert('❌ Could not load payroll history');
    }
  }
  setShowHistory(!showHistory); // Toggle display
};

useEffect(() => {
  if (activeTab === 'payroll') {
   fetch(`${baseURL}/api/employees`)
      .then(res => res.json())
      .then(data => setAllEmployees(data));
   fetch(`${baseURL}/api/payroll/paid/${currentMonth}`)
      .then(res => res.json())
      .then(data => setPaidEmployees(data.map(p => p.employee._id))); // only IDs
  }
}, [activeTab, currentMonth]);const
 isPaid = (empId) => {
  return paidEmployees.includes(empId);
};

const toggleSelect = (empId) => {
  setSelectedEmployees(prev =>
    prev.includes(empId) ? prev.filter(id => id !== empId) : [...prev, empId]
  );
};

const selectAll = () => {
  const unpaidIds = allEmployees
    .filter(emp => !isPaid(emp._id))
    .map(emp => emp._id);
  setSelectedEmployees(unpaidIds);
};

const unselectAll = () => setSelectedEmployees([]);
const handlePaySelected = async () => {
  if (selectedEmployees.length === 0) return;

  try {
    setIsLoading(true);

    await axios.post(`${baseURL}/api/payroll/pay`, {
      employeeIds: selectedEmployees,
      month: currentMonth,
    });

    const { data } = await axios.get(`${baseURL}/api/payroll/paid/${currentMonth}`);
    setPaidEmployees(data.map(p => p.employee._id)); // ensure only IDs

    setSelectedEmployees([]);
    alert('✅ Salary paid successfully!');
  } catch (err) {
    console.error('Error paying salary:', err);
    alert('❌ Failed to process payroll');
  } finally {
    setIsLoading(false);
  }
};

const fetchJobs = async () => {
  try {
    console.log('🔄 Fetching jobs...');
    const res = await fetch(`${baseURL}/api/jobs`);

    const data = await res.json();
    console.log('📦 Jobs fetched from backend:', data); // ✅ Confirm what was received
    setJobs(data); // ✅ Sets all jobs to state
  } catch (err) {
    console.error('❌ Error fetching jobs', err);
  }
};


useEffect(() => {
  fetchJobs();
}, []);


const handleTabChange = (tab) => {
  setActiveTabFilter(tab);
};

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setNewJob((prev) => ({ ...prev, [name]: value }));
};

const handleAddJob = async (e) => {
  e.preventDefault();
  try {
  await axios.post(`${baseURL}/api/jobs/add`, newJob);

    setNewJob({
      title: '',
      department: '',
      location: '',
      status: 'open',
      experience: ''
    });
    setShowAddForm(false);
    fetchJobs();
  } catch (err) {
    console.error('Error adding job', err);
  }
};

useEffect(() => {
  let jobsToShow = [...jobs];

  if (activeTabFilter !== 'all') {
    jobsToShow = jobsToShow.filter(job => job.status === activeTabFilter);
  }

  const keyword = search.toLowerCase();
  const filtered = jobsToShow.filter(job =>
    job.title.toLowerCase().includes(keyword) ||
    job.department.toLowerCase().includes(keyword) ||
    job.location.toLowerCase().includes(keyword)
  );

  setFilteredJobs(filtered);
}, [jobs, search, activeTabFilter]);




const handleLeaveAction = (leaveId, status) => {
  const backendAction = status === 'Approved' ? 'approve' : 'reject';

  fetch(`${baseURL}/api/leaves/${leaveId}/${backendAction}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  })

    .then(res => res.json())
    .then(() => {
      setLeaves(prev =>
        prev.map(leave =>
          leave._id === leaveId ? { ...leave, status } : leave
        )
      );
    })
    .catch(err => console.error('Error updating leave status', err));
};
useEffect(() => {
  if (activeTab === 'leaves') {
    // Fetch leave requests
   fetch(`${baseURL}/api/leaves/all`)
      .then(res => res.json())
      .then(data => setLeaves(data))
      .catch(err => console.error('Error fetching leave data', err));

    // Fetch attendance records
    const query = attendanceDate ? `?date=${attendanceDate}` : '';
    fetch(`${baseURL}/api/attendance/all${query}`)

      .then(res => res.json())
      .then(data => {
        const sorted = [...data].sort((a, b) => {
          const todayStr = new Date().toISOString().split('T')[0];
          return a.date === todayStr ? -1 : b.date === todayStr ? 1 : 0;
        });
        setAttendanceRecords(sorted);
      })
      .catch(err => console.error('Error fetching attendance records', err));
  }
}, [activeTab, attendanceDate]);


  useEffect(() => {
   fetch(`${baseURL}/api/employees`)
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(err => console.error('Error fetching employees', err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('hrToken');
    navigate('/');
  };
  const [leaves, setLeaves] = useState([]);

useEffect(() => {
  if (activeTab === 'leaves') {
    fetch(`${baseURL}/api/leaves/all`)
      .then(res => res.json())
      .then(data => setLeaves(data))
      .catch(err => console.error('Error fetching leave data', err));
  }
}, [activeTab]);


  const uniqueDepartments = [...new Set(employees.map(emp => emp.department))];

  const filterEmployees = (list) =>
    list.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchText.toLowerCase()) ||
        emp.designation.toLowerCase().includes(searchText.toLowerCase());
      const matchesDept = filterDept === '' || emp.department === filterDept;
      return matchesSearch && matchesDept;
    });

  const exportPDFStyled = (rows, columns, title, fileName) => {
    const doc = new jsPDF({ unit: 'pt', format: 'A4' });

    doc.setFontSize(18);
    doc.setTextColor('#2e2e2e');
    doc.text(title, 40, 40);

    const dateStr = new Date().toLocaleString('en-IN');
    doc.setFontSize(10);
    doc.setTextColor('#555');
    doc.text(`Printed on: ${dateStr}`, 40, 60);
    doc.text(`Printed by: HR`, 40, 75);

    doc.setLineWidth(0.5);
    doc.setDrawColor('#aaa');
    doc.line(40, 85, doc.internal.pageSize.width - 40, 85);

    autoTable(doc, {
      startY: 95,
      head: [columns],
      body: rows,
      styles: { fontSize: 10, textColor: '#333', cellPadding: 6 },
      headStyles: { fillColor: [63, 81, 181], textColor: '#fff', fontStyle: 'bold' },
      alternateRowStyles: { fillColor: '#f9f9f9' },
      margin: { left: 40, right: 40 }
    });

    doc.setFontSize(48);
    doc.setTextColor(230, 230, 230);
    doc.text('UNIFIEDOPS', doc.internal.pageSize.width / 2, doc.internal.pageSize.height / 2, {
      align: 'center',
      angle: 45
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

  const tabs = [
    { key: 'employees', label: 'Employees' },
    { key: 'leaves', label: 'Attendance & Leaves' },
    { key: 'payroll', label: 'Payroll & Performance ' },
    { key: 'jobs', label: 'Job Openings' },
  ];

  return (
    <div className="hr-dashboard">
      <aside className="sidebar">
        <div className="logo">UnifiedOps <span className="hrm-tag">HRM</span></div>
        <nav className="nav">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`nav-item ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <button className="logout-button" onClick={handleLogout}>⎋ Logout</button>
      </aside>

      <main className="content">
        <header className="topbar">
          <h1>{tabs.find(t => t.key === activeTab)?.label}</h1>
          <div className="profile-avatar">👩‍💼</div>
        </header>

        <section className="main-section">
          {activeTab === 'employees' && (
            <div className="card employee-section">
              <div className="card-header">
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
                <button className="add-btn" onClick={() => navigate(`${baseURL}/manager/add-employee`)}>
                  Add Employee
                </button>
              </div>

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
            </div>
          )}

        {activeTab === 'leaves' && (
  <>
    {/* Leave Requests Table */}
    <div className="card">
      <h2>Leave Requests</h2>
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Email</th>
            <th>Department</th>
            <th>Leave Date</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaves.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', color: '#888' }}>
                No leave requests found.
              </td>
            </tr>
          ) : (
            leaves.map((leave) => (
              <tr key={leave._id}>
                <td>{leave.employee?.name || 'N/A'}</td>
                <td>{leave.employee?.email || 'N/A'}</td>
                <td>{leave.employee?.department || 'N/A'}</td>
                <td>{leave.date}</td>
                <td>{leave.reason}</td>
                <td>
                  <span className={`status ${leave.status.toLowerCase()}`}>
                    {leave.status}
                  </span>
                </td>
                <td>
                  {leave.status?.toLowerCase() === 'pending' && (
                    <div className="action-buttons">
                      <button
                        className="approve-btn"
                        onClick={() => handleLeaveAction(leave._id, 'Approved')}
                      >
                        Approve
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleLeaveAction(leave._id, 'Rejected')}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    {/* Employee Attendance Table */}
    <div className="card" style={{ marginTop: '2rem' }}>
      <h2>Employee Attendance</h2>
      <div className="attendance-controls">
        <label htmlFor="attendance-date">Filter by date:</label>
        <input
          id="attendance-date"
          type="date"
          value={attendanceDate}
          onChange={(e) => setAttendanceDate(e.target.value)}
        />
        <button onClick={() => setAttendanceDate('')}>Clear Filter</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Employee</th>
            <th>Email</th>
            <th>Department</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {attendanceRecords.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', color: '#888' }}>
                No attendance records found.
              </td>
            </tr>
          ) : (
            attendanceRecords.map((record, index) => (
              <tr key={index}>
                <td>{record.date}</td>
                <td>{record.employee?.name || 'N/A'}</td>
                <td>{record.employee?.email || 'N/A'}</td>
                <td>{record.employee?.department || 'N/A'}</td>
                <td>
                  <span className={`status ${record.status.toLowerCase()}`}>
                    {record.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </>
)}

{activeTab === 'payroll' && (
  <div className="card payroll-section">
    <h2>📊 Payroll Overview – {currentMonth}</h2>

    {/* Metrics */}
    <div className="payroll-metrics">
      <div className="payroll-metric">
        <p>Total Payroll</p>
        <h3>
          ₹{allEmployees.reduce((sum, e) => sum + Number(e.salary || 0), 0).toLocaleString('en-IN')}
        </h3>
        <span className="change positive">+10%</span>
      </div>
      <div className="payroll-metric">
        <p>Average Salary</p>
        <h3>
          ₹{Math.round(
            allEmployees.reduce((sum, e) => sum + Number(e.salary || 0), 0) / (allEmployees.length || 1)
          ).toLocaleString('en-IN')}
        </h3>
        <span className="change negative">-5%</span>
      </div>
      <div className="payroll-metric">
        <p>Employees Paid</p>
        <h3>{paidEmployees.length}</h3>
        <span className="change positive">+2%</span>
      </div>
    </div>

    {/* Progress Bar */}
    <h3 className="section-title">Payroll Processing</h3>
    <p>Processing Status</p>
    <div className="progress-bar">
      <div
        className="progress"
        style={{
          width: `${Math.round((paidEmployees.length / (allEmployees.length || 1)) * 100)}%`
        }}
      ></div>
    </div>
    <p className="progress-label">
      {Math.round((paidEmployees.length / (allEmployees.length || 1)) * 100)}% complete
    </p>

    {/* Actions */}
    <div className="payroll-actions">
      <button
        className="primary-btn"
        onClick={handlePaySelected}
        disabled={selectedEmployees.length === 0 || isLoading}
      >
        {isLoading ? '⏳ Processing...' : `💸 Run Payroll (${selectedEmployees.length})`}
      </button>

     <button
  className="secondary-btn"
  onClick={handleViewPayrollHistory}
  disabled={isLoading}
>
  📑 View Payroll History
</button>

    </div>

    {isLoading && (
      <p style={{ marginTop: '8px', color: '#666' }}>⏳ Processing payroll...</p>
    )}

    {/* Table */}
    <h3 className="section-title"> Employees Salary list for {currentMonth}</h3>
    <div className="payroll-controls">
      <button onClick={selectAll} disabled={isLoading}>Select All</button>
      <button onClick={unselectAll} disabled={isLoading}>Unselect All</button>
    </div>

    <table className="payroll-table">
      <thead>
  <tr>
    <th>Select</th>
    <th>Name</th>
    <th>Email</th>
    <th>Department</th>
    <th>Salary</th>
    <th>Status</th>
    <th>Actions</th> 
  </tr>
</thead>

      <tbody>
        {allEmployees.length === 0 ? (
          <tr>
            <td colSpan="6" style={{ textAlign: 'center' }}>No employees found.</td>
          </tr>
        ) : (
          allEmployees.map((emp) => {
            const isPaid = paidEmployees.includes(emp._id);

            return (
              <tr key={emp._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedEmployees.includes(emp._id)}
                    onChange={() => toggleSelect(emp._id)}
                    disabled={isPaid}
                  />
                </td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.department}</td>
                <td>₹{Number(emp.salary).toLocaleString('en-IN')}</td>
                <td>
                  {isPaid ? (
                    <span className="badge paid">Paid</span>
                  ) : (
                    <span className="badge unpaid">Unpaid</span>
                  )}
                </td>
                
<td> {/* ✅ NEW */}
  <button
  className="secondary-btn small"
  onClick={() => handleViewPerformance(emp._id)} // ✅ USE IT HERE
>
  📊 View Performance
</button>

</td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>

    {/* History Section */}
    {showHistory && (
  <>
    <h3 className="section-title">📄 Payroll History</h3>
    <table className="payroll-history-table">
      <thead>
        <tr>
          <th>Employee</th>
          <th>Month</th>
          <th>Paid On</th>
        </tr>
      </thead>
      <tbody>
        {payrollHistory.length === 0 ? (
          <tr>
            <td colSpan="3" style={{ textAlign: 'center' }}>No payroll history available.</td>
          </tr>
        ) : (
          payrollHistory.map((entry, index) => (
            <tr key={index}>
              <td>{entry.employee?.name || '—'}</td>
              <td>{entry.month}</td>
              <td>
                {entry.paidOn
                  ? new Date(entry.paidOn).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })
                  : '—'}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </>
)}
{/* Performance Section */}
<h3 className="section-title">📊 Employee Performance</h3>

{selectedEmployeeId && (
  <p style={{ fontStyle: 'italic', marginBottom: '10px' }}>
    Showing performance for:{" "}
    <b>{allEmployees.find(e => e._id === selectedEmployeeId)?.name || '—'}</b>
  </p>
)}

<div
  ref={performanceRef}
  className={`performance-box ${highlighted ? 'highlight-glow' : ''}`}
  style={{
    display: 'flex',
    gap: '2rem',
    flexWrap: 'wrap',
    backgroundColor: '#f9f9ff',
    border: '1px solid #d3d3f3',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.06)',
  }}
>
  {/* Stats Column */}
  <div style={{ flex: 1, minWidth: 280 }}>
    <div style={{ marginBottom: '10px' }}>
      <p><b>Total Tasks:</b> {performanceStats?.totalTasks ?? '—'}</p>
      <p><b>✅ Completed:</b> {performanceStats?.completedTasks ?? '—'}</p>
      <p><b>🔄 In Progress:</b> {performanceStats?.inProgressTasks ?? '—'}</p>
      <p><b>🕒 Pending:</b> {performanceStats?.pendingTasks ?? '—'}</p>
    </div>

    <h2 style={{ fontSize: '22px', color: '#4f46e5', marginTop: '1rem' }}>
      {performanceStats?.taskCompletionRate ?? '—'}% Completion
    </h2>

    <p style={{ marginTop: '8px', fontWeight: 500 }}>
      ⏱ On Time: <span style={{ color: '#444' }}>{performanceStats?.onTimeRate ?? '—'}%</span>
    </p>

    <p style={{ marginTop: '8px' }}>
      🕓 <b>Total Hours Worked:</b> {performanceStats?.totalHoursWorked ?? '—'} hrs
    </p>

    <p style={{ marginTop: '8px' }}>
      <b>Rating:</b>{" "}
      <span style={{
        color:
          performanceStats?.taskCompletionRate >= 90 ? '#28a745'
          : performanceStats?.taskCompletionRate >= 70 ? '#ffc107'
          : '#dc3545'
      }}>
        {performanceStats?.taskCompletionRate >= 90
          ? "🌟 Excellent"
          : performanceStats?.taskCompletionRate >= 70
          ? "✅ Good"
          : "⚠️ Needs Improvement"}
      </span>
    </p>
  </div>

  {/* Bar Chart Column */}
  <div style={{ flex: 1, minWidth: 300 }}>
    {barData.length > 0 ? (
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={barData}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="tasks" fill="#4f46e5" barSize={40} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    ) : (
      <p style={{ color: '#888' }}>No monthly performance data available.</p>
    )}
  </div>
</div>

      </div>

  
)}
{activeTab === 'jobs' && (
  <div className="card job-openings-section">
    <div className="job-header">
      <h2>Job Openings</h2>
      <button className="add-btn light" onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? 'Close' : 'New Job Opening'}
      </button>
    </div>

    {/* Add Job Form */}
    {showAddForm && (
      <form className="job-form" onSubmit={handleAddJob}>
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={newJob.title}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={newJob.department}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={newJob.location}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="experience"
          placeholder="Experience (e.g. 2+ years)"
          value={newJob.experience}
          onChange={handleInputChange}
          required
        />
        <select name="status" value={newJob.status} onChange={handleInputChange}>
          <option value="open">Open</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <button type="submit" className="primary-btn">Add Job</button>
      </form>
    )}

    <div className="job-tabs">
      {['all', 'draft', 'archived'].map((tab) => (
        <button
          key={tab}
          className={`tab ${activeTabFilter === tab ? 'active' : ''}`}
          onClick={() => handleTabChange(tab)}
        >
          {tab === 'all' ? 'All Openings' : tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>

    <div className="search-container">
      <input
        type="text"
        placeholder="Search job openings"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>

    <table className="job-table">
      <thead>
        <tr>
          <th>Job Title</th>
          <th>Department</th>
          <th>Location</th>
          <th>Experience(in Years)</th>
          <th>Status</th>
         
          <th>Date Posted</th>
        </tr>
      </thead>
     <tbody>
  {(filteredJobs && filteredJobs.length > 0 ? filteredJobs : jobs).length === 0 ? (
    <tr>
      <td colSpan="7" style={{ textAlign: 'center' }}>No job openings found.</td>
    </tr>
  ) : (
    (filteredJobs && filteredJobs.length > 0 ? filteredJobs : jobs).map((job) => (
      <tr key={job._id}>
        <td>{job.title}</td>
        <td>{job.department}</td>
        <td>{job.location}</td>
        <td>{job.experience}</td>
        <td>
          <span className={`status ${job.status}`}>{job.status}</span>
        </td>
        
        <td>{new Date(job.postedDate).toLocaleDateString()}</td>
      </tr>
    ))
  )}
</tbody>


    </table>
  </div>
)}


        </section>
      </main>
    </div>
  );
};

export default HRDashboard;
