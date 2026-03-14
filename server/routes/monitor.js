const express = require('express');
const router = express.Router();
const storage = require('../services/storage');

// Get all monitors
router.get('/monitors', (req, res) => {
    const monitors = storage.getMonitors();
    res.json(monitors);
});

// Add new monitor
router.post('/monitor', (req, res) => {
    const { url, email } = req.body;
    
    if (!url || !email) {
        return res.status(400).json({ error: 'URL and Email are required' });
    }

    // Basic URL validation
    if (!url.includes('bookmyshow.com')) {
        return res.status(400).json({ error: 'Please provide a valid BookMyShow URL' });
    }

    const monitor = storage.addMonitor({ url, email });
    res.status(201).json(monitor);
});

module.exports = router;
