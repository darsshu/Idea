const Monitor = require('../models/monitor.model');

const getMonitors = async (userId) => {
    try {
        const query = userId ? { createdBy: userId } : {};
        return await Monitor.find(query);
    } catch (error) {
        console.error('Error reading storage:', error);
        return [];
    }
};

const addMonitor = async (monitorData) => {
    try {
        const monitor = new Monitor(monitorData);
        await monitor.save();
        return monitor;
    } catch (error) {
        console.error('Error adding monitor:', error);
        throw error;
    }
};

const updateMonitor = async (id, updates) => {
    try {
        return await Monitor.findByIdAndUpdate(id, updates, { new: true });
    } catch (error) {
        console.error('Error updating monitor:', error);
        return null;
    }
};

const deleteMonitor = async (id, userId) => {
    try {
        const query = { _id: id };
        if (userId) query.createdBy = userId;
        const result = await Monitor.findOneAndDelete(query);
        return !!result;
    } catch (error) {
        console.error('Error deleting monitor:', error);
        return false;
    }
};

module.exports = {
    getMonitors,
    addMonitor,
    updateMonitor,
    deleteMonitor
};
