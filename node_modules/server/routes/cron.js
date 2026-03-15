const express = require('express');
const router = express.Router();
const monitorService = require('../services/monitor.service');

// Vercel Cron Endpoint
router.get('/cron', async (req, res) => {
    // Only allow Vercel or authorized requests if needed
    // if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return res.status(401).end('Unauthorized');
    // }

    try {
        const results = await monitorService.runMonitoringCycle();
        res.json({ success: true, results });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
