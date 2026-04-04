const mongoose = require('mongoose');

const choreSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  icon:        { type: String },
  description: { type: [String], default: [] },
  time:        { type: String, default: null },
  repeating:   { type: Boolean, default: false },
  assignedTo:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  house:       { type: mongoose.Schema.Types.ObjectId, ref: 'House', required: true },
  dueDate:     { type: Date },
  completed:   { type: Boolean, default: false },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Chore', choreSchema);