const express = require('express');
const router = express.Router();
const Chore = require('../models/Chore');

// Create a chore (admin only)
router.post('/', async (req, res) => {
  try {
    const chore = new Chore(req.body);
    await chore.save();
    res.status(201).json(chore);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/house/:houseId', async (req, res) => {
  try {
    const query = { house: req.params.houseId };
    if (req.query.memberId) query.assignedTo = req.query.memberId;

    const chores = await Chore.find(query).populate('assignedTo');
    res.json(chores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a chore
router.put('/:id', async (req, res) => {
  try {
    const chore = await Chore.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(chore);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a chore
router.delete('/:id', async (req, res) => {
  try {
    await Chore.findByIdAndDelete(req.params.id);
    res.json({ message: 'Chore deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;