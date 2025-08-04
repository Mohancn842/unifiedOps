import React, { useEffect, useState } from 'react';
import { fetchEmployeesWithTasks } from '../../services/employeeService';
const baseURL = process.env.REACT_APP_API_BASE_URL;

const EmployeesWithTasks = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchEmployeesWithTasks();
        setEmployees(data);
      } catch (error) {
        console.error('Failed to fetch employees with tasks:', error);
        alert('Error loading data');
      }
    };
    loadData();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🧑‍💼 Employees With Assigned Tasks & Projects</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Department</th>
            <th style={styles.th}>Designation</th>
            <th style={styles.th}>Projects</th>
            <th style={styles.th}>Tasks</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td style={styles.td}>{emp.name}</td>
              <td style={styles.td}>{emp.email}</td>
              <td style={styles.td}>{emp.department}</td>
              <td style={styles.td}>{emp.designation}</td>

              <td style={styles.td}>
                <ul style={styles.list}>
                  {(emp.projects || []).map((proj) => (
                    <li key={proj._id}>
                      📁 {proj.name} <span style={{ color: '#666' }}>({proj.status})</span>
                    </li>
                  ))}
                </ul>
              </td>

              <td style={styles.td}>
                <ul style={styles.list}>
                  {(emp.tasks || []).map((task) => (
                    <li key={task._id}>
                      📝 {task.title} – <span style={{ color: '#007bff' }}>{task.status}</span>
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    padding: 40,
    background: '#f4f8fc',
    minHeight: '100vh',
    fontFamily: 'sans-serif'
  },
  heading: {
    fontSize: 22,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  table: {
    width: '100%',
    background: '#fff',
    borderCollapse: 'collapse',
    borderRadius: 8,
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  th: {
    background: '#3c5ccf',
    color: '#fff',
    padding: 12,
    textAlign: 'left'
  },
  td: {
    padding: 12,
    borderBottom: '1px solid #eee',
    verticalAlign: 'top'
  },
  list: {
    paddingLeft: 16,
    margin: 0,
    listStyle: 'none'
  }
};

export default EmployeesWithTasks;
