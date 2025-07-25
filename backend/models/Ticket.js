const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  raisedBy: {
    type: mongoose.Schema.Types.ObjectId,
    // ✅ Support marketing employee reference
    refPath: 'raisedByModel',
    required: true
  },
 raisedByModel: {
  type: String,
  required: true,
  enum: ['User', 'MarketingEmployee', 'SalesEmployee', 'SalesManager']  // 👈 add this
}
,

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SupportEmployee',
    default: null
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

ticketSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Ticket', ticketSchema);
