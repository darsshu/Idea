const express = require('express');
const router = express.Router();
const Event = require('../models/event.model');
const { protect, authorize } = require('../middleware/auth');

// Get all events
router.get('/events', async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch events', message: err.message });
    }
});

// Create event
router.post('/events', protect, authorize('admin'), async (req, res) => {
    try {
        const { title, imageUrl, eventUrl } = req.body;
        
        if (!title || !imageUrl || !eventUrl) {
            return res.status(400).json({ error: 'Please provide title, imageUrl, and eventUrl' });
        }
        
        const newEvent = new Event({ title, imageUrl, eventUrl });
        await newEvent.save();
        
        res.status(201).json(newEvent);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create event', message: err.message });
    }
});

// Delete event
router.delete('/events/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const evt = await Event.findById(req.params.id);
        if (!evt) {
            return res.status(404).json({ error: 'Event not found' });
        }
        await evt.deleteOne();
        res.json({ message: 'Event removed' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete event', message: err.message });
    }
});

module.exports = router;
