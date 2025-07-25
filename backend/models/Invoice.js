const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AccountProject',
    unique: true, // 🚫 Only one invoice per project
  },
  clientName: String,
  clientEmail: String,
  clientPhone: String,
  clientAddress: String,
  advance: Number,
  totalAmount: Number,
  balance: Number,
  gstIncluded: Boolean,
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
