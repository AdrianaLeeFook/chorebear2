const express = require('express');
const router = express.Router();
const Membership = require('../models/Membership');

// Join a house
router.post('/', async (req, res) => {
  try {
    const membership = new Membership(req.body);
    await membership.save();
    res.status(201).json(membership);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all members of a house
router.get('/house/:houseId', async (req, res) => {
  try {
    const memberships = await Membership.find({ house: req.params.houseId }).populate('user');
    const members = memberships.map(m => m.user);
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all houses a user belongs to
router.get('/user/:userId', async (req, res) => {
  try {
    const memberships = await Membership.find({ user: req.params.userId }).populate('house');
    res.json(memberships);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove a member from a house
router.delete('/:id', async (req, res) => {
  try {
    await Membership.findByIdAndDelete(req.params.id);
    res.json({ message: 'Membership removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;