import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
const baseURL = process.env.REACT_APP_API_BASE_URL;


export default function AccountInvoiceDashboard() {
  const [projects, setProjects] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [view, setView] = useState('');
  const [currentPayment, setCurrentPayment] = useState(0);
  const [editingInvoiceId, setEditingInvoiceId] = useState(null);

  const [form, setForm] = useState({
    projectName: '', startDate: '', endDate: '',
    estimatedAmount: '', spentAmount: '', description: ''
  });

  const [invoiceForm, setInvoiceForm] = useState({
    project: '', clientName: '', clientEmail: '',
    clientPhone: '', clientAddress: '', advance: 0, totalAmount: 0, balance: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const projRes = await axios.get(`${baseURL}/account-projects`);
    const invRes = await axios.get(`${baseURL}/invoices`);
    setProjects(projRes.data);
    setInvoices(invRes.data);
  };

  const handleAddProject = async () => {
    const { projectName, startDate, endDate, estimatedAmount, spentAmount, description } = form;

    // Simple Validation
    if (!projectName || !startDate || !endDate || !estimatedAmount || !spentAmount || !description) {
      alert("❗ Please fill in all fields before submitting.");
      return;
    }

    try {
      await axios.post(`${baseURL}/account-projects`, form);
      setForm({ projectName: '', startDate: '', endDate: '', estimatedAmount: '', spentAmount: '', description: '' });
      fetchData();
    } catch (error) {
      alert("❌ Failed to add project. Please try again.");
      console.error(error);
    }
  };



  const generateInvoicePDF = (invoiceData) => {
  const doc = new jsPDF();

  // Company Info
  doc.setFontSize(14);
  doc.text('Manage Nest', 14, 20);
  doc.setFontSize(10);
  doc.text('Mysore', 14, 25);
  doc.text('Owner: Mohan C N', 14, 30);
  doc.text('Email: managenest@example.com', 14, 35);
  doc.text('Phone: +91-9876543210', 14, 40);

  // Invoice Title
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text('INVOICE', 160, 20);

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Issued Date: ${new Date().toLocaleDateString()}`, 160, 30);
  doc.text(`Invoice Number: INV-${Math.floor(1000 + Math.random() * 9000)}`, 160, 35);
  doc.text(`Client ID: ${invoiceData.clientEmail}`, 160, 40);

  // Bill To
  doc.setFont(undefined, 'bold');
  doc.text('Billed To:', 14, 55);
  doc.setFont(undefined, 'normal');
  doc.text(invoiceData.clientName, 14, 60);
  doc.text(invoiceData.clientAddress, 14, 65);
  doc.text(`Phone: ${invoiceData.clientPhone}`, 14, 70);
  doc.text(`Email: ${invoiceData.clientEmail}`, 14, 75);

  // Table
  const basePrice = (invoiceData.totalAmount / 1.18).toFixed(2);
  const gst = (invoiceData.totalAmount - basePrice).toFixed(2);
  const advance = invoiceData.advance.toFixed(2);
  const balance = invoiceData.balance.toFixed(2);

  doc.autoTable({
    startY: 85,
    head: [['Description', 'Cost', 'Qty', 'Amount']],
    body: [
      [`Project: ${invoiceData.projectName}`, `₹${basePrice}`, '1', `₹${basePrice}`]
    ]
  });

  // Summary Table
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 10,
    head: [['Subtotal', 'GST (18%)', 'Advance Paid', 'Total', 'Balance']],
    body: [[
      `₹${basePrice}`,
      `₹${gst}`,
      `₹${advance}`,
      `₹${invoiceData.totalAmount.toFixed(2)}`,
      `₹${balance}`
    ]]
  });

  // Footer
  doc.setFontSize(10);
  doc.text('Please return payment within 30 days from Issued Date.', 14, doc.lastAutoTable.finalY + 20);
  doc.setFont(undefined, 'bold');
  doc.text('Thank you for your business!', 14, doc.lastAutoTable.finalY + 30);

  // Download PDF
  doc.save(`Invoice_${invoiceData.clientName}.pdf`);
};
  const handleInvoiceSubmit = async () => {
    const selectedProject = projects.find(p => p._id === invoiceForm.project);
    const balance = invoiceForm.totalAmount - invoiceForm.advance;

    const invoiceData = {
      ...invoiceForm,
      projectName: selectedProject?.projectName || '',
      balance: balance < 0 ? 0 : balance
    };

    if (editingInvoiceId) {
      await axios.put(`${baseURL}/invoices/${editingInvoiceId}`, invoiceData);
    } else {
      await axios.post(`${baseURL}/invoices`, invoiceData);
    }

    generateInvoicePDF(invoiceData);
    setInvoiceForm({ project: '', clientName: '', clientEmail: '', clientPhone: '', clientAddress: '', advance: 0, totalAmount: 0, balance: 0 });
    setEditingInvoiceId(null);
    setView('');
    fetchData();
  };

  const usedProjectIds = invoices.map(i => i.project?._id);
  const availableProjects = projects.filter(p => !usedProjectIds.includes(p._id));

  return (
    <div className="container">
      <h2>📊 Manage Nest — Account & Invoice Dashboard</h2>

      <div className="button-row">
        <button onClick={() => setView('addProject')}>➕ Add Project</button>
        <button onClick={() => setView('project')}>📋 Display Projects</button>
        <button onClick={() => {
          setEditingInvoiceId(null);
          setInvoiceForm({ project: '', clientName: '', clientEmail: '', clientPhone: '', clientAddress: '', advance: 0, totalAmount: 0, balance: 0 });
          setView('invoice');
        }}>🧾 Add Invoice</button>
        <button onClick={() => setView('editInvoice')}>✏️ Edit Invoice</button>
      </div>

      {/* Project Form */}
      {view === 'addProject' && (
        <div className="form-section">
          <h3>Add New Project</h3>
          <input placeholder="Project Name" value={form.projectName} onChange={e => setForm({ ...form, projectName: e.target.value })} />
          <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
          <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
          <input placeholder="Estimated Amount" type="number" value={form.estimatedAmount} onChange={e => setForm({ ...form, estimatedAmount: e.target.value })} />
          <input placeholder="Spent Amount" type="number" value={form.spentAmount} onChange={e => setForm({ ...form, spentAmount: e.target.value })} />
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <button onClick={handleAddProject}>Add Project</button>
        </div>
      )}

      {/* Project Display */}
      {view === 'project' && (
        <div>
          <h3>All Projects</h3>
          <table>
            <thead>
              <tr>
                <th>Project</th><th>Duration</th><th>Estimate</th><th>Spent</th><th>Description</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p._id}>
                  <td>{p.projectName}</td>
                  <td>{p.startDate} to {p.endDate}</td>
                  <td>₹{p.estimatedAmount}</td>
                  <td>₹{p.spentAmount}</td>
                  <td>{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Invoice Form */}
      {view === 'invoice' && (
        <div className="form-section">
          <h3>{editingInvoiceId ? 'Update Invoice' : 'Generate Invoice'}</h3>
          <label>Select Project:</label>
          <select value={invoiceForm.project} onChange={e => setInvoiceForm({ ...invoiceForm, project: e.target.value })} disabled={editingInvoiceId !== null}>
            <option value="">Select Project</option>
            {(editingInvoiceId ? projects : availableProjects).map(p => (
              <option key={p._id} value={p._id}>{p.projectName}</option>
            ))}
          </select>

          <label>Client Name:</label>
          <input value={invoiceForm.clientName} onChange={e => setInvoiceForm({ ...invoiceForm, clientName: e.target.value })} />
          <label>Client Email:</label>
          <input value={invoiceForm.clientEmail} onChange={e => setInvoiceForm({ ...invoiceForm, clientEmail: e.target.value })} />
          <label>Client Phone:</label>
          <input value={invoiceForm.clientPhone} onChange={e => setInvoiceForm({ ...invoiceForm, clientPhone: e.target.value })} />
          <label>Client Address:</label>
          <input value={invoiceForm.clientAddress} onChange={e => setInvoiceForm({ ...invoiceForm, clientAddress: e.target.value })} />
          <label>Advance Paid:</label>
          <input type="number" value={invoiceForm.advance} onChange={e => setInvoiceForm({ ...invoiceForm, advance: +e.target.value })} />
          <label>Base Amount (Before GST):</label>
          <input type="number"
            onChange={e => {
              const base = +e.target.value;
              const gst = base * 0.18;
              setInvoiceForm({ ...invoiceForm, totalAmount: base + gst });
            }} />
          <p><strong>Total Amount (incl. 18% GST): ₹{invoiceForm.totalAmount.toFixed(2)}</strong></p>
          <button onClick={handleInvoiceSubmit}>{editingInvoiceId ? 'Update Invoice' : 'Generate Invoice'}</button>
        </div>
      )}

      {/* Edit Invoice Table */}
      {view === 'editInvoice' && (
        <div className="container">
          <h3>All Invoices</h3>
          <table>
            <thead>
              <tr>
                <th>Project</th><th>Client</th><th>Total Amount</th><th>Advance</th><th>Balance</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv._id}>
                  <td>{inv.project?.projectName || "Deleted"}</td>
                  <td>{inv.clientName}</td>
                  <td>₹{inv.totalAmount.toFixed(2)}</td>
                  <td>₹{inv.advance.toFixed(2)}</td>
                  <td>₹{inv.balance.toFixed(2)}</td>
                  <td>
                    {inv.balance > 0 ? (
                      <button onClick={() => {
                        setInvoiceForm(inv);
                        setEditingInvoiceId(inv._id);
                        setCurrentPayment(0);
                      }}>Edit</button>
                    ) : (
                      <span style={{ color: 'green', fontWeight: 'bold' }}>Paid</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Inline Payment Editor */}
          {editingInvoiceId && (
            <div className="edit-form">
              <h4>Edit Invoice Balance</h4>
              <p><strong>Total Amount:</strong> ₹{invoiceForm.totalAmount.toFixed(2)}</p>
              <p><strong>Advance Paid:</strong> ₹{invoiceForm.advance.toFixed(2)}</p>
              <p><strong>Current Balance:</strong> ₹{invoiceForm.balance.toFixed(2)}</p>

              <label>Current Payment:</label>
              <input type="number" value={currentPayment} onChange={e => setCurrentPayment(Number(e.target.value))} />

              <button onClick={async () => {
                const updatedAdvance = invoiceForm.advance + currentPayment;
                const updatedBalance = invoiceForm.totalAmount - updatedAdvance;
                const updated = { ...invoiceForm, advance: updatedAdvance, balance: updatedBalance < 0 ? 0 : updatedBalance };

                await axios.put(`${baseURL}/invoices/${editingInvoiceId}`, updated);
              
                setEditingInvoiceId(null);
                setCurrentPayment(0);
                fetchData();
              }}>
                Update Balance
              </button>
            </div>
          )}
        </div>
      )}

      {/* Scoped CSS */}
      <style>{`
        .container {
          max-width: 1000px;
          margin: auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        .button-row button {
          margin: 5px;
          padding: 10px 16px;
          background: #1976d2;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .form-section {
          background: #f4f4f4;
          padding: 20px;
          margin-top: 20px;
          border-radius: 8px;
        }
        .form-section input, .form-section select, .form-section textarea {
          width: 100%;
          padding: 8px;
          margin: 6px 0;
          border-radius: 4px;
          border: 1px solid #ccc;
        }
        label {
          font-weight: bold;
          display: block;
          margin-top: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }
        th, td {
          border: 1px solid #ccc;
          padding: 10px 12px;
          text-align: left;
        }
        th {
          background-color: #e0e0e0;
        }
        .edit-form {
          margin-top: 20px;
          padding: 20px;
          border-radius: 8px;
          background: #f9f9f9;
        }
        .edit-form input {
          width: 100%;
          padding: 8px;
          margin: 5px 0 15px 0;
        }
      `}</style>
    </div>
  );
}