const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Monitor = require('./server/models/monitor.model');
require('dotenv').config({ path: './server/.env' });

const migrate = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI is not defined in .env');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const DATA_FILE = path.join(__dirname, './server/data/monitors.json');
        if (!fs.existsSync(DATA_FILE)) {
            console.log('No monitors.json file found. Nothing to migrate.');
            process.exit(0);
        }

        const data = fs.readFileSync(DATA_FILE, 'utf8');
        const monitors = JSON.parse(data);

        console.log(`Found ${monitors.length} monitors to migrate.`);

        for (const monitor of monitors) {
            // Remove the old string-based id if it exists
            const { id, ...monitorData } = monitor;
            
            // Check if already exists by URL and Email to avoid duplicates
            const existing = await Monitor.findOne({ url: monitor.url, email: monitor.email });
            if (!existing) {
                await Monitor.create(monitorData);
                console.log(`Migrated: ${monitor.url}`);
            } else {
                console.log(`Skipped (already exists): ${monitor.url}`);
            }
        }

        console.log('Migration complete!');
        process.exit(0);
    } catch (error) {
        console.error('Migration error:', error);
        process.exit(1);
    }
};

migrate();
