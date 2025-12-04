const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const calculatePriority = require('../utils/calculatePriority');
const smartRouting = require('../utils/smartRouting');

// POST /api/reports - create a report
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    smartRouting(data);
    data.priorityScore = calculatePriority({ votes: data.votes, severity: data.severity || 1, createdAt: data.createdAt });
    const rep = new Report(data);
    await rep.save();
    res.status(201).json(rep);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

// GET /api/reports - list reports with optional query filters
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.owner) filter.primaryOwner = req.query.owner;
    const reports = await Report.find(filter).sort({ priorityScore: -1, createdAt: -1 }).limit(100);
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// PATCH /api/reports/:id/upvote - increment votes and recalc priority
router.patch('/:id/upvote', async (req, res) => {
  try {
    const rep = await Report.findById(req.params.id);
    if (!rep) return res.status(404).json({ error: 'Not found' });
    rep.votes = (rep.votes || 0) + 1;
    rep.priorityScore = calculatePriority({ votes: rep.votes, severity: req.body.severity || 1, createdAt: rep.createdAt });
    await rep.save();
    res.json(rep);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upvote' });
  }
});

// PATCH /api/reports/:id/status - update status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const rep = await Report.findById(req.params.id);
    if (!rep) return res.status(404).json({ error: 'Not found' });
    rep.status = status || rep.status;
    await rep.save();
    // TODO: generate a mocked notification when resolved
    res.json(rep);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

module.exports = router;
