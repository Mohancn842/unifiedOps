const Job = require('../models/Job');

// POST /api/jobs/add
const addJob = async (req, res) => {
  try {
    const { title, department, location, status, experience } = req.body;

    const newJob = new Job({
      title,
      department,
      location,
      status,
      experience,
      postedDate: new Date()
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (err) {
    console.error('❌ Error adding job:', err);
    res.status(500).json({ message: 'Failed to add job.' });
  }
};

// GET /api/jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ postedDate: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    console.error('❌ Error fetching jobs:', err);
    res.status(500).json({ message: 'Failed to fetch jobs.' });
  }
};

module.exports = {
  addJob,
  getJobs
};
