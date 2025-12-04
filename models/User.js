const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  role: { type: String, enum: ['Citizen', 'Admin', 'Utility_Worker'], default: 'Citizen' }
});

module.exports = mongoose.model('User', UserSchema);
