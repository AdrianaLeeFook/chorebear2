const express = require('express');
const router = express.Router();
const House = require('../models/House');

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
    res.status(201).json(house);
  } catch (err) {
    console.error('error creating house:', err);
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