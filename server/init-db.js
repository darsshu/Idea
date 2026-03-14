const mongoose = require('mongoose');
require('dotenv').config();

// Pre-load models to ensure they are registered with Mongoose
const User = require('./models/user.model');
const Monitor = require('./models/monitor.model');

async function initDB() {
    console.log('--- MongoDB Initialization ---');
    
    if (!process.env.MONGODB_URI) {
        console.error('❌ Error: MONGODB_URI is not defined in .env file');
        process.exit(1);
    }

    try {
        console.log('⏳ Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB successfully!');

        // Get list of existing collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);
        
        console.log('\n📊 Current Database State:');
        console.log(`- Collections: ${collectionNames.length > 0 ? collectionNames.join(', ') : 'None (collections are created automatically when data is saved)'}`);
        
        console.log('\n🚀 Your database is ready. The "users" and "monitors" collections will appear as soon as you register your first user or create a monitor.');
        
        process.exit(0);
    } catch (err) {
        console.error('\n❌ Connection Error:', err.message);
        console.log('Tip: Check your MONGODB_URI and ensure your IP address is whitelisted in MongoDB Atlas.');
        process.exit(1);
    }
}

initDB();
