const express = require('express');
const router = express.Router();
const connectDB = require('../services/db');
const storage = require('../services/storage');
const scraper = require('../services/scraper');
const notifier = require('../services/notifier');

// Vercel Cron Endpoint
router.get('/cron', async (req, res) => {
    // Only allow Vercel or authorized requests if needed
    // if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return res.status(401).end('Unauthorized');
    // }

    console.log('--- Starting Monitoring Cycle via Vercel Cron ---');
    
    try {
        await connectDB();
        const monitors = await storage.getMonitors();

        const results = [];
        for (const monitor of monitors) {
            try {
                console.log(`Checking: ${monitor.url} for ${monitor.email}`);
                const result = await scraper.checkAvailability(monitor.url);
                
                const statusChanged = monitor.isAvailable !== result.available;
                
                await storage.updateMonitor(monitor.id, {
                    isAvailable: result.available,
                    status: result.available ? 'Available' : 'Sold Out',
                    matchName: result.title,
                    lastChecked: new Date().toISOString()
                });

                if (result.available && statusChanged) {
                    console.log(`!!! Tickets Available for ${result.title} !!!`);
                    await notifier.sendNotification(monitor.email, monitor.url, result.title);
                }
                
                results.push({ url: monitor.url, status: 'Checked' });
            } catch (error) {
                console.error(`Error monitoring ${monitor.url}:`, error.message);
                results.push({ url: monitor.url, status: 'Error', error: error.message });
            }
        }
        
        console.log('--- Monitoring Cycle Complete ---');
        res.json({ success: true, results });
    } catch (error) {
        console.error('Cron error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
