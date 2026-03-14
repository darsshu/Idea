const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    imageUrl: {
        type: String,
        required: [true, 'Please add an image URL'],
        trim: true
    },
    eventUrl: {
        type: String,
        required: [true, 'Please add an event URL'],
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Event', eventSchema);
