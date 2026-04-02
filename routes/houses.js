const express = require('express');
const router = express.Router();
const House = require('../models/House');
const Membership = require('../models/Membership');

// Generate a random 6 character code
const generateCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// helper function to generate a random 6-character code
function generateHomeCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';

  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
}

// Create a house
router.post('/', async (req, res) => {
  try {
    const { name, createdBy } = req.body;


    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'home name is required' });
    }

    if (!createdBy) {
      return res.status(400).json({ message: 'createdBy is required' });
    }

    let code;
    let existingHouse;

    do {
      code = generateHomeCode();
      existingHouse = await House.findOne({ code });
    } while (existingHouse);

    const house = new House({
      name: name.trim(),
      code,
      createdBy,
    });
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
    console.error('error creating house:', err);
    res.status(500).json({ message: err.message });
  }
});

router.post('/join', async (req, res) => {
  try {
    const { code, userId } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ message: 'home code is required' });
    }

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const house = await House.findOne({ code: code.trim().toUpperCase() });
    if (!house) return res.status(404).json({ message: 'invalid home code' });

    const existing = await Membership.findOne({ user: userId, house: house._id });
    if (existing) return res.status(400).json({ message: 'Already a member' });

    const membership = new Membership({
      user: userId,
      house: house._id,
      role: 'member',
    });
    await membership.save();

    res.status(201).json({ home: house, membership });
  } catch (err) {
    console.error('error joining house:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get all houses
router.get('/', async (req, res) => {
  try {
    const houses = await House.find().populate('createdBy');
    res.json(houses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a house
router.put('/:id', async (req, res) => {
  try {
    const house = await House.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
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