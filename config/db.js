const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/launchforge';
    console.log(`[Database] Attempting connection to MongoDB...`);
    
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[Database] MongoDB Connected Successfully! Host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] MongoDB connection failed: ${error.message}`);
    console.log(`[Database Note] Make sure MONGODB_URI in your .env or Atlas settings is correct.`);
  }
};

module.exports = connectDB;
