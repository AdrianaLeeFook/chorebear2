const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// create notification
router.post('/', async (req, res) => {
  try {
    const { houseId, message, type, createdBy } = req.body;

    if (!houseId || !message) {
      return res.status(400).json({ message: 'houseId and message are required' });
    }

    const notification = new Notification({
      houseId,
      message,
      type: type || 'general',
      createdBy: createdBy || null,
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// get notifications by house
router.get('/house/:houseId', async (req, res) => {
  try {
    const notifications = await Notification.find({
      houseId: req.params.houseId,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// delete notification
router.delete('/:id', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;