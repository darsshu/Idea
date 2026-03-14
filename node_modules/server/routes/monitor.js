const express = require('express');
const router = express.Router();
const connectDB = require('../services/db');
const storage = require('../services/storage');

// Get all monitors
router.get('/monitors', async (req, res) => {
    await connectDB();
    const monitors = await storage.getMonitors();
    res.json(monitors);
});

// Add new monitor
router.post('/monitor', async (req, res) => {
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

        const monitor = await storage.addMonitor({ url, email });
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
router.delete('/monitor/:id', async (req, res) => {
    const { id } = req.params;
    const deleted = await storage.deleteMonitor(id);
    if (deleted) {
        res.json({ message: 'Monitor deleted successfully' });
    } else {
        res.status(404).json({ error: 'Monitor not found' });
    }
});

module.exports = router;
