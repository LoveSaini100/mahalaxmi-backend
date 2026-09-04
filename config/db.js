const mongoose = require('mongoose');

let isMongoConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mahalaxmi_property',
      {
        serverSelectionTimeoutMS: 2500,
      }
    );
    isMongoConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isMongoConnected = false;
    console.warn(`--------------------------------------------------`);
    console.warn(` MongoDB Connection Warning: ${error.message}`);
    console.warn(` In-Memory Storage Active: Backend will handle all CRUD APIs seamlessly.`);
    console.warn(`--------------------------------------------------`);
  }
};

const getMongoStatus = () => isMongoConnected;

module.exports = { connectDB, getMongoStatus };
