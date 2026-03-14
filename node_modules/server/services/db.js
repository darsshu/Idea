const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('CRITICAL: MONGODB_URI is not defined in environment variables.');
    console.error('Please add MONGODB_URI to your Vercel Project Settings > Environment Variables.');
    throw new Error('Please define the MONGODB_URI environment variable inside .env or Vercel settings');
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
        cached.conn = await cached.promise;
        console.log('MongoDB successfully connected');
    } catch (e) {
        console.error('MongoDB connection failed:', e.message);
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

module.exports = connectDB;
