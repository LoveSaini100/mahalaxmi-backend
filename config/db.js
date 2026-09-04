const mongoose = require('mongoose');

let isMongoConnected = false;
let connPromise = null;

const DEFAULT_MONGO_URI =
  'mongodb+srv://mahalaxmiproperties83_db_user:DCFKwJjVfcdRMXIV@cluster1.yzfqgvv.mongodb.net/?appName=Cluster1';

const connectDB = async () => {
  if (isMongoConnected && mongoose.connection.readyState === 1) {
    return true;
  }

  if (!connPromise || mongoose.connection.readyState === 0) {
    const uri = process.env.MONGODB_URI || DEFAULT_MONGO_URI;
    connPromise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 5000,
      })
      .then((conn) => {
        isMongoConnected = true;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return true;
      })
      .catch((error) => {
        isMongoConnected = false;
        connPromise = null;
        console.warn(`MongoDB Connection Warning: ${error.message}`);
        return false;
      });
  }

  return connPromise;
};

const getMongoStatus = () => isMongoConnected && mongoose.connection.readyState === 1;

module.exports = { connectDB, getMongoStatus };
