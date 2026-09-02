const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  const connStr = process.env.MONGODB_URI;

  if (!connStr) {
    console.error('[Database Error] MONGODB_URI environment variable is missing!');
    throw new Error('MONGODB_URI environment variable is not set on Vercel.');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Don't buffer queries if DB is not connected
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(connStr, opts).then((mongooseInstance) => {
      console.log(`[Database] MongoDB Atlas Connected: ${mongooseInstance.connection.host}`);
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error(`[Database Error] Mongoose connection error: ${e.message}`);
    throw e;
  }

  return cached.conn;
};

module.exports = connectDB;
