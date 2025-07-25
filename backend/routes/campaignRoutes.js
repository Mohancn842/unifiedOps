const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const MarketingEmployee = require('../models/MarketingEmployee');

// ✅ Create new campaign
router.post('/', async (req, res) => {
  try {
    const campaign = new Campaign(req.body);
    await campaign.save();
    res.status(201).json(campaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ error: 'Server error while creating campaign' });
  }
});

// ✅ Get all campaigns (with team info populated)
router.get('/', async (req, res) => {
  try {
    const campaigns = await Campaign.find().populate({
      path: 'assignedTeam',
      populate: {
        path: 'members', // if your Team model has a `members` array
        select: 'name email' // limit populated fields if needed
      }
    });
    res.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: 'Server error while fetching campaigns' });
  }
});

// ✅ Update a campaign
router.put('/:id', async (req, res) => {
  try {
    const updated = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({ error: 'Server error while updating campaign' });
  }
});

// ✅ Get campaigns assigned to a team based on employee ID
router.get('/team/:employeeId', async (req, res) => {
  try {
    const employee = await MarketingEmployee.findById(req.params.employeeId).populate('team');

    if (!employee || !employee.team) {
      return res.status(404).json({ message: 'Team not found for this employee' });
    }

    const campaigns = await Campaign.find({ assignedTeam: employee.team._id }).populate('assignedTeam');
    res.json(campaigns);
  } catch (error) {
    console.error('Error fetching team campaigns:', error);
    res.status(500).json({ message: 'Server error while fetching team campaigns' });
  }
});

module.exports = router;
