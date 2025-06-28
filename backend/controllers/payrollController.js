const SalaryPayment = require('../models/SalaryPayment');
const Employee = require('../models/Employee');

// POST /api/payroll/pay
const paySalaries = async (req, res) => {
  try {
    const { employeeIds, month } = req.body;

    if (!employeeIds || !month) {
      return res.status(400).json({ message: 'employeeIds and month are required' });
    }

    const employees = await Employee.find({ _id: { $in: employeeIds } });

    const paidSalaries = [];

    for (let emp of employees) {
      const alreadyPaid = await SalaryPayment.findOne({ employee: emp._id, month });
      if (alreadyPaid) continue;

      const payment = new SalaryPayment({
        employee: emp._id,
        amount: emp.salary,
        month,
      });

      await payment.save();
      paidSalaries.push(payment);
    }

    res.status(200).json({
      message: `Salary paid to ${paidSalaries.length} employee(s) for ${month}`,
      data: paidSalaries,
    });
  } catch (err) {
    console.error('Error paying salaries:', err);
    res.status(500).json({ message: 'Server error while paying salaries' });
  }
};

// GET /api/payroll/paid/:month
const getPaidSalariesForMonth = async (req, res) => {
  try {
    const { month } = req.params;
    const payments = await SalaryPayment.find({ month }).populate('employee');

    const validPayments = payments.filter(p => p.employee && p.employee._id);
    res.json(validPayments);
  } catch (err) {
    console.error('Error fetching paid salaries:', err);
    res.status(500).json({ message: 'Server error while fetching payroll' });
  }
};

// GET /api/payroll/history
const getPayrollHistory = async (req, res) => {
  try {
    const history = await SalaryPayment.find({})
      .populate('employee')
      .sort({ paidAt: -1 });

    res.json(history);
  } catch (err) {
    console.error('Error fetching payroll history:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  paySalaries,
  getPaidSalariesForMonth,
  getPayrollHistory,
};
