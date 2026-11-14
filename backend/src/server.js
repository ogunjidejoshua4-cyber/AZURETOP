const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const passport = require('passport');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB database
connectDB();

// Initialize Express application
const app = express();

// Middleware
app.use(cors()); // Enables Cross-Origin Resource Sharing so our frontends can talk to this backend
app.use(express.json()); // Parses incoming JSON payloads from requests
// Initialize passport middleware
app.use(passport.initialize());
// Mount auth routes
app.use('/api/auth', require('./routes/authRoutes'));
// Mount product routes
app.use('/api/products', require('./routes/productRoutes'));
// Mount category routes
app.use('/api/categories', require('./routes/categoryRoutes'));
// Mount upload routes
app.use('/api/upload', require('./routes/uploadRoutes'));
// Mount order routes
app.use('/api/orders', require('./routes/orderRoutes'));

// Health check endpoint (vital for Render & UptimeRobot monitoring)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    message: 'E-commerce API is running smoothly',
    timestamp: new Date()
  });
});

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});