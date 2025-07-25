const express = require('express');
const router = express.Router();
const Invoice = require('../models/invoice');

router.post('/', async (req, res) => {
  try {
    const existing = await Invoice.findOne({ project: req.body.project });
    if (existing) {
      return res.status(400).json({ error: 'Invoice already exists for this project' });
    }

    const balance = req.body.totalAmount - req.body.advance;
    const invoice = new Invoice({ ...req.body, balance });
    const saved = await invoice.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const invoices = await Invoice.find().populate('project');
  res.json(invoices);
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Invoice.findByIdAndUpdate(
      req.params.id,
      { ...req.body, balance: req.body.totalAmount - req.body.advance },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
