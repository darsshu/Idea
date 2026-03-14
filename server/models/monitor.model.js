const mongoose = require('mongoose');

const monitorSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    status: {
        type: String,
        default: 'Active'
    },
    isAvailable: {
        type: Boolean,
        default: false
    },
    matchName: {
        type: String,
        default: ''
    },
    lastChecked: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Convert _id to id for frontend compatibility
monitorSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.models.Monitor || mongoose.model('Monitor', monitorSchema);
