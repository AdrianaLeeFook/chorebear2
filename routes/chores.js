const express = require('express');
const router = express.Router();
const Chore = require('../models/Chore');
const Notification = require('../models/Notification');

// Create a chore
router.post('/', async (req, res) => {
  try {
    const chore = new Chore(req.body);
    await chore.save();

    await Notification.create({
      houseId: chore.house,
      message: `A new chore "${chore.title}" was created`,
      type: 'chore',
      createdBy: chore.createdBy,
    });

    res.status(201).json(chore);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get chores by house
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
    const existingChore = await Chore.findById(req.params.id).populate('assignedTo');

    if (!existingChore) {
      return res.status(404).json({ message: 'Chore not found' });
    }

    const wasCompleted = existingChore.completed;

    const updatedChore = await Chore.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('assignedTo');

    if (req.body.completed === true && wasCompleted === false) {
      await Notification.create({
        houseId: updatedChore.house,
        message: `${updatedChore.assignedTo?.username || 'Someone'} completed "${updatedChore.title}"`,
        type: 'chore_completed',
        createdBy: updatedChore.assignedTo?._id || null,
      });
    }

    res.json(updatedChore);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a chore
router.delete('/:id', async (req, res) => {
  try {
    const chore = await Chore.findById(req.params.id);

    if (!chore) {
      return res.status(404).json({ message: 'Chore not found' });
    }

    await Notification.create({
      houseId: chore.house,
      message: `The chore "${chore.title}" was deleted`,
      type: 'chore_deleted',
      createdBy: chore.createdBy || null,
    });

    await Chore.findByIdAndDelete(req.params.id);

    res.json({ message: 'Chore deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;