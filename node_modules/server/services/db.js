const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is MISSING in environment variables.');
    console.log('Current environment variables:', Object.keys(process.env).filter(key => !key.includes('SECRET') && !key.includes('KEY')));
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development and serverless function invocations in production.
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        console.log('Attempting to connect to MongoDB...');
        cached.conn = await cached.promise;
        console.log('✅ MongoDB successfully connected');
    } catch (e) {
        console.error('❌ MongoDB connection failed:', e.message);
        console.error('Full connection error:', e);
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

module.exports = connectDB;
