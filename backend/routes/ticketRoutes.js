const express = require('express');
const Ticket = require('../models/Ticket');
const router = express.Router();

// ✅ Raise a ticket
router.post('/raise', async (req, res) => {
  try {
    const ticket = new Ticket(req.body);
    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    console.error('❌ Ticket creation failed:', err);
    res.status(500).json({ error: 'Failed to raise ticket' });
  }
});

// ✅ Get all tickets (Support Manager view)
router.get('/', async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate('raisedBy', 'name email')
      .populate('assignedTo', 'name email');
    res.json(tickets);
  } catch (err) {
    console.error('❌ Fetch all tickets failed:', err);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// ✅ Assign a ticket to a support employee
router.put('/assign/:ticketId', async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { assignedTo } = req.body;

    const updated = await Ticket.findByIdAndUpdate(
      ticketId,
      {
        assignedTo,
        status: 'In Progress',
      },
      { new: true }
    ).populate('assignedTo', 'name email');

    res.json(updated);
  } catch (err) {
    console.error('❌ Assign ticket error:', err);
    res.status(500).json({ error: 'Failed to assign ticket' });
  }
});

// ✅ Get all tickets raised by a specific employee (sales or marketing)
router.get('/user/:userId/:model', async (req, res) => {
  try {
    const { userId, model } = req.params;

    const tickets = await Ticket.find({
      raisedBy: userId,
      raisedByModel: model, // either "SalesEmployee" or "MarketingEmployee"
    })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (err) {
    console.error('❌ Ticket fetch error:', err);
    res.status(500).json({ message: 'Error fetching user tickets' });
  }
});

// ✅ Update status of a ticket (for support employee)
router.put('/status/:ticketId', async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
      ticketId,
      { status, updatedAt: new Date() },
      { new: true }
    )
      .populate('assignedTo', 'name email')
      .populate('raisedBy', 'name email');

    res.json(updatedTicket);
  } catch (err) {
    console.error('❌ Ticket status update failed:', err);
    res.status(500).json({ error: 'Failed to update ticket status' });
  }
});

module.exports = router;
