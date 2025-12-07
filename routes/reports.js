const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const calculatePriority = require('../utils/calculatePriority');
const smartRouting = require('../utils/smartRouting');
const upload = require('../middleware/upload');

// POST /api/reports - create a report (with optional image upload)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('Received report submission');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    
    const data = JSON.parse(req.body.data || '{}'); // Parse JSON data from FormData
    
    // If image was uploaded, add Cloudinary URL to data
    if (req.file) {
      console.log('Image uploaded to:', req.file.path);
      data.image = req.file.path; // Cloudinary URL
    }
    
    smartRouting(data);
    data.priorityScore = calculatePriority({ votes: data.votes || 1, severity: data.severity || 1, createdAt: data.createdAt || new Date() });
    
    const rep = new Report(data);
    await rep.save();
    console.log('Report saved successfully:', rep._id);
    res.status(201).json(rep);
  } catch (err) {
    console.error('Error creating report:');
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    res.status(500).json({ error: 'Failed to create report', details: err.message });
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
