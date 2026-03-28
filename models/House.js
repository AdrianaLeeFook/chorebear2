const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  code:      { type: String, required: true, unique: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('House', houseSchema);