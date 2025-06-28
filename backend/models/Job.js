const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, default: 'Remote' },
  status: { type: String, enum: ['open', 'draft', 'archived'], default: 'open' },
  applications: { type: Number, default: 0 },
  experience: { type: String, required: true },
  postedDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Job', jobSchema);
