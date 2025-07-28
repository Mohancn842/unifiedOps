import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MarketingManager() {
  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);
  const [campaignStats, setCampaignStats] = useState({ total: 0, active: 0 });
  const [monthlyCounts, setMonthlyCounts] = useState(Array(12).fill(0));
  const baseURL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [empRes, teamRes, campaignRes] = await Promise.all([
          axios.get(`${baseURL}/api/marketing-employees`),
          axios.get(`${baseURL}/api/marketing-teams`),
          axios.get(`${baseURL}/api/campaigns`),
        ]);

        setEmployees(empRes.data);
        setTeams(teamRes.data);

        const today = new Date().setHours(0, 0, 0, 0);
        const campaigns = campaignRes.data;

        const total = campaigns.length;
        const active = campaigns.filter(c => new Date(c.date).setHours(0, 0, 0, 0) >= today).length;

        // Count campaigns per month
        const monthly = Array(12).fill(0);
        campaigns.forEach(c => {
          const d = new Date(c.date || c.createdAt);
          const month = d.getMonth(); // 0 = Jan, 11 = Dec
          monthly[month]++;
        });
        setMonthlyCounts(monthly);
        setCampaignStats({ total, active });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAll();
  }, []);

  const teamOverview = {
    totalMembers: employees.length,
    totalCampaigns: campaignStats.total,
    activeCampaigns: campaignStats.active,
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/'; // Redirect to login page
  };

  return (
    <>
      <style>{`
        body {
          margin: 0;
          background-color: #f9fafb;
          font-family: 'Segoe UI', sans-serif;
        }
        .dashboard-container {
          display: flex;
        }
        .sidebar {
          width: 220px;
          background-color: #ffffff;
          border-right: 1px solid #e5e7eb;
          padding: 20px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .sidebar h2 {
          font-size: 20px;
          margin-bottom: 20px;
          font-weight: 700;
        }
        .sidebar nav ul {
          list-style: none;
          padding: 0;
          flex-grow: 1;
        }
        .sidebar nav ul li {
          margin-bottom: 15px;
          cursor: pointer;
          padding: 10px 12px;
          border-radius: 8px;
          transition: background 0.3s;
        }
        .sidebar nav ul li:hover {
          background-color: #e5e7eb;
        }
        .new-campaign-btn {
          background-color: #3b82f6;
          color: white;
          padding: 10px;
          border: none;
          border-radius: 8px;
          margin-top: 30px;
          cursor: pointer;
          width: 100%;
          font-weight: 500;
        }
        .help-link {
          font-size: 13px;
          margin-top: 20px;
          color: #6b7280;
        }
        .dashboard-main {
          flex: 1;
          padding: 40px;
        }
        .dashboard-main h1 {
          font-size: 28px;
          margin-bottom: 8px;
        }
        .subheading {
          color: #6b7280;
          margin-bottom: 30px;
        }
        .team-overview {
          display: flex;
          gap: 20px;
          margin-bottom: 25px;
        }
        .card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 20px;
          flex: 1;
          text-align: center;
        }
        .quick-actions {
          margin-bottom: 30px;
        }
        .btn-primary {
          background-color: #3b82f6;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 6px;
          margin-right: 10px;
          font-weight: 500;
          cursor: pointer;
        }
        .btn-secondary {
          background-color: #e5e7eb;
          color: #374151;
          border: none;
          padding: 10px 16px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
        }
        .campaign-performance {
          margin-bottom: 40px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
        }
        .campaign-performance .growth {
          color: #16a34a;
          font-size: 14px;
          margin-bottom: 12px;
        }
        .bar-chart {
          display: flex;
          align-items: end;
          height: 120px;
          gap: 20px;
        }
        .bar-item {
          text-align: center;
          flex: 1;
        }
        .bar {
          background-color: #dbeafe;
          width: 100%;
          border-radius: 4px;
        }
        .lead-assignments {
          margin-top: 30px;
        }
        .lead-assignments h2 {
          margin-bottom: 10px;
        }
        .team-details {
          margin-top: 40px;
        }
        .team-details h2 {
          margin-bottom: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        th, td {
          padding: 12px 16px;
          border-bottom: 1px solid #e5e7eb;
          text-align: left;
        }
        th {
          background-color: #f3f4f6;
        }
        .logout-btn {
          background-color: #ef4444;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          margin-top: auto;
        }
        .logout-btn:hover {
          background-color: #dc2626;
        }
      `}</style>

      <div className="dashboard-container">
        <aside className="sidebar">
          <h2>Marketing Hub</h2>
          <nav>
            <ul>
              <li><a href="/create-team" style={{ textDecoration: 'none', color: 'inherit' }}>Create Team</a></li>
              <li><a href="/create-campaign" style={{ textDecoration: 'none', color: 'inherit' }}>Create Campaign</a></li>
              <li><a href="/view-campaign" style={{ textDecoration: 'none', color: 'inherit' }}>View & Edit Campaign</a></li>
              <li><a href="/addmarketingemployee" style={{ textDecoration: 'none', color: 'inherit' }}>Add Employee</a></li>
            </ul>
          </nav>

          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </aside>

        <main className="dashboard-main">
          <h1>Dashboard</h1>
          <p className="subheading">Manage your team, leads, and campaigns effectively.</p>

          <section className="team-overview">
            <div className="card">Total Team Members <strong>{teamOverview.totalMembers}</strong></div>
            <div className="card">Total Campaigns <strong>{teamOverview.totalCampaigns}</strong></div>
            <div className="card">Active Campaigns <strong>{teamOverview.activeCampaigns}</strong></div>
          </section>

          <section className="quick-actions">
            <a href="/create-team" style={{ textDecoration: 'none' }}>
              <button className="btn-primary">Assign Leads</button>
            </a>
           <a href="/create-campaign" style={{ textDecoration: 'none' }}>
              <button className="btn-primary">Create Campaign</button>
            </a>
            <a href="/view-campaign" style={{ textDecoration: 'none' }}>
              <button className="btn-primary">View Campaign</button>
            </a>
          </section>

          <section className="campaign-performance">
            <h2>Campaign Performance</h2>
            <p><strong>Total Campaigns:</strong> {campaignStats.total}</p>
            <p><strong>Active Campaigns:</strong> {campaignStats.active}</p>

            <div className="bar-chart">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, idx) => (
                <div key={idx} className="bar-item">
                  <div className="bar" style={{
                    height: `${monthlyCounts[idx] * 10}px`,
                    backgroundColor: monthlyCounts[idx] > 0 ? '#3b82f6' : '#d1d5db',
                  }}></div>
                  <span style={{ fontSize: '12px' }}>{month}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="lead-assignments">
            <h2>Marketing Employees</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Team</th>
                  <th>Salary</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp._id}>
                    <td>{emp.name}</td>
                    <td>{emp.email}</td>
                    <td>{emp.department || '-'}</td>
                    <td>{emp.designation || '-'}</td>
                    <td>{emp.team?.name || '-'}</td>
                    <td>₹{emp.salary || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="team-details">
            <h2>Team Details</h2>
            <table>
              <thead>
                <tr>
                  <th>Team Name</th>
                  <th>Team Lead</th>
                  <th>No. of Members</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team) => (
                  <tr key={team._id}>
                    <td>{team.name}</td>
                    <td>{team.teamLead?.name || '-'}</td>
                    <td>{team.members?.length || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </>
  );
}

export default MarketingManager;
