const storage = require('./storage');
const scraper = require('./scraper');
const notifier = require('./notifier');
const connectDB = require('./db');

/**
 * Runs the monitoring cycle for all active monitors
 * @returns {Promise<Array>} Results of the monitoring cycle
 */
const runMonitoringCycle = async () => {
    console.log('--- Starting Monitoring Cycle ---');
    
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
                    matchName: monitor.matchName || result.title,
                    lastChecked: new Date().toISOString()
                });

                if (result.available && statusChanged) {
                    console.log(`!!! Tickets Available for ${result.title || monitor.matchName} !!!`);
                    await notifier.sendNotification(monitor.email, monitor.url, result.title || monitor.matchName);
                }

                results.push({ url: monitor.url, status: 'Checked', available: result.available });
            } catch (error) {
                console.error(`Error monitoring ${monitor.url}:`, error.message);
                results.push({ url: monitor.url, status: 'Error', error: error.message });
            }
        }

        console.log('--- Monitoring Cycle Complete ---');
        return results;
    } catch (error) {
        console.error('Monitoring cycle failed:', error);
        throw error;
    }
};

module.exports = { runMonitoringCycle };
