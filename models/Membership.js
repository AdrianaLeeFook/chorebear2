const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  house:    { type: mongoose.Schema.Types.ObjectId, ref: 'House', required: true },
  role:     { type: String, enum: ['admin', 'member'], default: 'member' },
  joinedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Membership', membershipSchema);