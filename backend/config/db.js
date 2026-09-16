const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.log('ℹ️  No MONGODB_URI provided. Running in high-performance in-memory mock store mode.');
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2500
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️  MongoDB connection skipped/failed (${error.message}). Using seamless built-in data store.`);
  }
};

module.exports = connectDB;
