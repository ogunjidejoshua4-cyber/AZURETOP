const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the connection string from environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    // Exit process with failure if database connection fails
    process.exit(1);
  }
};

module.exports = connectDB;