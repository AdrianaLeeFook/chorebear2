const express = require('express');
const router = express.Router();
const House = require('../models/House');

// Create a house
router.post('/', async (req, res) => {
  try {
    const house = new House(req.body);
    await house.save();
    res.status(201).json(house);
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