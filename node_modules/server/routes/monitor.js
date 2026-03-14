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

        // Extract match name from URL
        let matchName = '';
        try {
            const urlObj = new URL(url);
            const parts = urlObj.pathname.split('/').filter(Boolean);
            const etIndex = parts.findIndex(p => p.startsWith('ET'));
            if (etIndex > 0) {
                const slug = parts[etIndex - 1];
                matchName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            } else if (parts.length >= 2) {
                const slug = parts[parts.length - 2];
                matchName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            }
            if (!matchName) matchName = 'Cricket Match';
        } catch (e) {
            matchName = 'Cricket Match';
        }

        const monitor = await storage.addMonitor({ 
            url, 
            email, 
            matchName,
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
