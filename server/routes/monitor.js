const express = require('express');
const router = express.Router();
const connectDB = require('../services/db');
const storage = require('../services/storage');
const { protect } = require('../middleware/auth');

// Get all monitors for the logged in user
router.get('/monitors', protect, async (req, res) => {
    await connectDB();
    const monitors = await storage.getMonitors(req.user.id);
    res.json(monitors);
});

// Add new monitor
router.post('/monitor', protect, async (req, res) => {
    try {
        await connectDB();
        const { url, email } = req.body;
        
        if (!url || !email) {
            return res.status(400).json({ error: 'URL and Email are required' });
        }

        // Basic URL validation
        if (!url.includes('bookmyshow.com')) {
            return res.status(400).json({ error: 'Please provide a valid BookMyShow URL' });
        }

        const monitor = await storage.addMonitor({ 
            url, 
            email, 
            createdBy: req.user.id 
        });
        res.status(201).json(monitor);
    } catch (error) {
        console.error('Error in POST /monitor:', error);
        res.status(500).json({ 
            error: 'Failed to create monitor', 
            details: error.message 
        });
    }
});

// Delete monitor
router.delete('/monitor/:id', protect, async (req, res) => {
    const { id } = req.params;
    const deleted = await storage.deleteMonitor(id, req.user.id);
    if (deleted) {
        res.json({ message: 'Monitor deleted successfully' });
    } else {
        res.status(404).json({ error: 'Monitor or user mismatch' });
    }
});

module.exports = router;
