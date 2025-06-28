// models/SalaryPayment.js
const mongoose = require('mongoose');

const salaryPaymentSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  amount: { type: Number, required: true },
  month: { type: String, required: true, trim: true }, // e.g. '2025-06'
  paidOn: { type: Date, default: Date.now }
});

salaryPaymentSchema.index({ employee: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('SalaryPayment', salaryPaymentSchema);
