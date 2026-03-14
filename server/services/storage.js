const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/monitors.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Initialize file if not exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

const getMonitors = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading storage:', error);
        return [];
    }
};

const saveMonitors = (monitors) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(monitors, null, 2));
    } catch (error) {
        console.error('Error saving storage:', error);
    }
};

const addMonitor = (monitor) => {
    const monitors = getMonitors();
    const newMonitor = {
        id: Date.now().toString(),
        ...monitor,
        status: 'Active',
        isAvailable: false,
        lastChecked: new Date().toISOString(),
        createdAt: new Date().toISOString()
    };
    monitors.push(newMonitor);
    saveMonitors(monitors);
    return newMonitor;
};

const updateMonitor = (id, updates) => {
    const monitors = getMonitors();
    const index = monitors.findIndex(m => m.id === id);
    if (index !== -1) {
        monitors[index] = { ...monitors[index], ...updates };
        saveMonitors(monitors);
        return monitors[index];
    }
    return null;
};

module.exports = {
    getMonitors,
    addMonitor,
    updateMonitor
};
