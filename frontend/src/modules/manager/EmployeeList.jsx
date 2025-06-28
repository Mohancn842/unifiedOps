import React, { useEffect, useState } from 'react';
import { fetchAllEmployeesWithProjects } from '../../services/employeeService';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchAllEmployeesWithProjects();
        setEmployees(data);
      } catch (error) {
        console.error('Failed to fetch employees:', error);
        alert('Failed to load employee data');
      }
    };
    getData();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>👥 List of Employees</h2>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              {[
                'Name', 'Email', 'Department', 'Designation', 'Salary',
                'Join Date', 'Contract Expiry', 'Contract File'
              ].map((heading, index) => (
                <th key={index} style={styles.th}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id} style={styles.row}>
                <td style={styles.tdLarge}>{emp.name}</td>
                <td style={styles.tdLarge}>{emp.email}</td>
                <td style={styles.td}>{emp.department}</td>
                <td style={styles.td}>{emp.designation}</td>
                <td style={styles.td}>
                  ₹{Number(emp.salary).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td style={styles.td}>{emp.join_date?.split('T')[0]}</td>
                <td style={styles.td}>{emp.contract_expiry?.split('T')[0]}</td>
                <td style={styles.td}>
                  {emp.contract_file ? (
                    <a
                      href={`http://localhost:5000/${emp.contract_file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.link}
                    >
                      View
                    </a>
                  ) : (
                    <em style={styles.none}>None</em>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    minHeight: '100vh',
    backgroundColor: '#f2f6fc',
    fontFamily: 'sans-serif',
  },
  heading: {
    textAlign: 'center',
    fontSize: '26px',
    fontWeight: 'bold',
    marginBottom: '30px',
    color: '#2a2a2a',
  },
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  headerRow: {
    backgroundColor: '#3c5ccf',
    color: '#fff',
  },
  th: {
    padding: '16px',
    color: '#fff',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '15px',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '14px 16px',
    fontSize: '14px',
    borderBottom: '1px solid #eee',
    color: '#333',
  },
  tdLarge: {
    padding: '14px 16px',
    fontSize: '15px',
    borderBottom: '1px solid #eee',
    fontWeight: '500',
    color: '#222',
  },
  link: {
    color: '#3c5ccf',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  none: {
    color: '#999',
    fontStyle: 'italic',
  },
  row: {
    backgroundColor: '#fff',
    transition: 'background 0.2s',
  },
};

export default EmployeeList;
