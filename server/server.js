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

// Connect to MongoDB
connectDB()
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

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
