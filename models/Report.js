const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  lat: { type: Number },
  lng: { type: Number },
  address: { type: String }
}, { _id: false });

const ReportSchema = new mongoose.Schema({
  location: { type: LocationSchema, required: true },
  category: { type: String, enum: ['Water', 'Roads', 'Power'], required: true },
  image: { type: String },
  status: { type: String, default: 'Open' },
  votes: { type: Number, default: 1 },
  priorityScore: { type: Number, default: 0 },
  primaryOwner: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);
