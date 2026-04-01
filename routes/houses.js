const express = require('express');
const router = express.Router();
const House = require('../models/House');
const Membership = require('../models/Membership');

// Generate a random 6 character code
const generateCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Create a house
router.post('/', async (req, res) => {
  try {
    const { name, createdBy } = req.body;
    
    // Keep generating until we get a unique code
    let code;
    let exists = true;
    while (exists) {
      code = generateCode();
      exists = await House.findOne({ code });
    }

    const house = new House({ name, code, createdBy });
    await house.save();

    // Automatically make the creator an admin member
    const membership = new Membership({
      user: createdBy,
      house: house._id,
      role: 'admin',
    });
    await membership.save();

    res.status(201).json(house);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Join a house by code
router.post('/join', async (req, res) => {
  try {
    const { code, userId } = req.body;
    const house = await House.findOne({ code });
    if (!house) return res.status(404).json({ message: 'House not found' });

    // Check if already a member
    const existing = await Membership.findOne({ user: userId, house: house._id });
    if (existing) return res.status(400).json({ message: 'Already a member' });

    const membership = new Membership({
      user: userId,
      house: house._id,
      role: 'member',
    });
    await membership.save();

    res.status(201).json({ house, membership });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all houses
router.get('/', async (req, res) => {
  try {
    const houses = await House.find();
    res.json(houses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a house
router.put('/:id', async (req, res) => {
  try {
    const house = await House.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(house);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a house
router.delete('/:id', async (req, res) => {
  try {
    await House.findByIdAndDelete(req.params.id);
    res.json({ message: 'House deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;