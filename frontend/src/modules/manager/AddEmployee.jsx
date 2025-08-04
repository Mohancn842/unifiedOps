import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    designation: '',
    salary: '',
    join_date: '',
    contract_expiry: '',
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_API_BASE_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const generatePDF = async (formData) => {
  const {
    name,
    designation,
    salary,
    contract_expiry,
    join_date,
  } = formData;

  const today = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const addBorder = (page) => {
    page.drawRectangle({
      x: 40,
      y: 40,
      width: 520,
      height: 670,
      borderWidth: 1,
      borderColor: rgb(0.6, 0.6, 0.6),
    });
  };

  // === PAGE 1 ===
  const page1 = pdfDoc.addPage([600, 750]);
  addBorder(page1);

  const draw = (page, text, x, y, opts = {}) => {
    page.drawText(text, {
      x,
      y,
      size: opts.size || 12,
      font: opts.bold ? boldFont : font,
      color: opts.color || rgb(0, 0, 0),
    });
  };

  let y = 690;

  draw(page1, 'Unified Ops', 230, y, { size: 20, bold: true, color: rgb(0, 0.4, 0.8) });
  y -= 30;
  draw(page1, 'Job Offer Letter', 230, y, { size: 14, bold: true });
  y -= 40;
  draw(page1, `Date: ${today}`, 60, y);
  y -= 30;

  // Bold Salary and Contract Expiry
  draw(page1, `Offered Salary: INR ${salary} per annum`, 60, y, { bold: true });
  y -= 20;
  draw(page1, `Contract Expiry: ${contract_expiry || 'N/A'}`, 60, y, { bold: true });
  y -= 40;

  draw(page1, `To,`, 60, y);
  y -= 20;
  draw(page1, `${name}`, 60, y);
  y -= 20;
  draw(page1, `Subject: Employment Opportunity at Unified Ops`, 60, y);
  y -= 40;

  const paragraph = [
    `Dear ${name},`,
    '',
    `We are delighted to offer you the position of ${designation} at Unified Ops.`,
    `You are expected to join on ${join_date} and report to your department remotely.`,
    '',
    `This offer is subject to company policies, verification of submitted documents, and`,
    `completion of onboarding procedures.`,
    '',
    `We believe your skills and experience will be a valuable asset to our team.`,
    '',
    `This letter is system-generated and does not require a physical signature.`,
  ];

  paragraph.forEach((line) => {
    draw(page1, line, 60, y);
    y -= 20;
  });

  y -= 10;
  draw(page1, 'Sincerely,', 60, y);
  y -= 20;
  draw(page1, 'HR Department', 60, y);
  draw(page1, 'Unified Ops', 60, y - 20);

  // === PAGE 2 ===
  const page2 = pdfDoc.addPage([600, 750]);
  addBorder(page2);
  let y2 = 700;

  draw(page2, 'Contract Terms & Conditions', 180, y2, { size: 14, bold: true });
  y2 -= 40;

  const terms = [
    '1. You are expected to maintain confidentiality of company and client information.',
    '2. The employment is subject to satisfactory performance and conduct.',
    '3. Termination requires 30 days written notice by either party.',
    '4. Salary is subject to statutory deductions as per government regulations.',
    '5. You must comply with all Unified Ops policies and guidelines.',
    '6. Misconduct may result in disciplinary action or termination.',
    '7. Remote work requires active daily reporting unless otherwise approved.',
    '8. Unified Ops reserves the right to modify policies with prior notice.',
  ];

  terms.forEach((line) => {
    draw(page2, line, 60, y2);
    y2 -= 30;
  });

  draw(page2, `Date: ${today}`, 60, y2 - 20, { size: 12 });
  draw(page2, 'Unified Ops HR Department', 60, y2 - 40, { size: 12 });

  const pdfBytes = await pdfDoc.save();
  return new File([pdfBytes], `${name.replace(/\s+/g, '_')}_Job_Offer_Letter.pdf`, {
    type: 'application/pdf',
  });
};



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const pdfFile = await generatePDF(formData);

      const data = new FormData();
      for (let key in formData) {
        data.append(key, formData[key]);
      }
      data.append('contract_file', pdfFile); // Auto-generated contract

      const response = await axios.post(`${baseURL}/api/employees`, data);
      setMessage({ type: 'success', text: response.data.message });

      setFormData({
        name: '', email: '', password: '', department: '', designation: '',
        salary: '', join_date: '', contract_expiry: '',
      });

      setTimeout(() => {
        navigate('/hr/dashboard');
      }, 2000);

    } catch (err) {
  console.error('Upload error:', err);
  setMessage({
    type: 'error',
    text: err.response?.data?.message || err.message || 'Something went wrong!',
  });
}

 finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={styles.heading}>➕ Add Employee</h2>

        {message.text && (
          <div
            style={{
              ...styles.message,
              ...(message.type === 'success' ? styles.success : styles.error),
            }}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {[
            { label: 'Name', name: 'name', type: 'text' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Password', name: 'password', type: 'text' },
            { label: 'Department', name: 'department', type: 'text' },
            { label: 'Designation', name: 'designation', type: 'text' },
            { label: 'Salary', name: 'salary', type: 'number', step: '0.01' },
            { label: 'Join Date', name: 'join_date', type: 'date' },
            { label: 'Contract Expiry', name: 'contract_expiry', type: 'date' },
          ].map((field, idx) => (
            <div key={idx} style={styles.formGroup}>
              <label style={styles.label}>{field.label}</label>
              <input
                style={styles.input}
                type={field.type}
                name={field.name}
                step={field.step || undefined}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.name !== 'contract_expiry'}
              />
            </div>
          ))}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Adding Employee...' : 'Add Employee'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    background: '#f2f6fc',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
  },
  formCard: {
    background: '#fff',
    padding: '30px',
    borderRadius: '20px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
    width: '100%',
    maxWidth: '600px',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  button: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(to right, #6a11cb, #2575fc)',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '20px',
  },
  message: {
    padding: '10px',
    borderRadius: '10px',
    marginBottom: '15px',
    textAlign: 'center',
  },
  success: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
};

export default AddEmployee;
