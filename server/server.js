const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./services/db');
const storage = require('./services/storage');
const monitorRoutes = require('./routes/monitor');
const cronRoutes = require('./routes/cron');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/event');
const cron = require('node-cron');
const monitorService = require('./services/monitor.service');

// Initialize local cron job for monitoring (runs every 1 minute)
// This will run when the server is running locally (npm run dev)
cron.schedule('* * * * *', async () => {
    console.log('--- Background Cron: Starting 1-minute check ---');
    try {
        await monitorService.runMonitoringCycle();
    } catch (err) {
        console.error('Background Cron Error:', err.message);
    }
});

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS with specific origin for production
app.use(cors({
    origin: ['https://idea-client-zeta.vercel.app', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error('Database connection middleware failed:', err.message);
        res.status(500).json({ 
            error: 'Database connection failed', 
            message: err.message,
            details: 'Please check MONGODB_URI and MongoDB Atlas IP Whitelisting (0.0.0.0/0)' 
        });
    }
});

// Routes
app.use('/api', monitorRoutes);
app.use('/api', cronRoutes);
app.use('/api', authRoutes);
app.use('/api', eventRoutes);

app.get('/', (req, res) => {
    res.send('Cricket Ticket Notifier API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
