const express = require('express');
const cors = require('cors');
require('dotenv').config();

const storage = require('./services/storage');
const monitorRoutes = require('./routes/monitor');
const scheduler = require('./services/scheduler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Start background monitoring
scheduler.startScheduler();

// Routes
app.use('/api', monitorRoutes);

app.get('/', (req, res) => {
    res.send('Cricket Ticket Notifier API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
