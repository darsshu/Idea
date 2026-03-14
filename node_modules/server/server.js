const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./services/db');
const storage = require('./services/storage');
const monitorRoutes = require('./routes/monitor');
const cronRoutes = require('./routes/cron');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
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
            details: 'Please check MONGODB_URI and IP Whitelisting' 
        });
    }
});

// Routes
app.use('/api', monitorRoutes);
app.use('/api', cronRoutes);

app.get('/', (req, res) => {
    res.send('Cricket Ticket Notifier API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
