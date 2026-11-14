const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Load environment variables so we can access MONGO_URI
dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...');

    // Define initial admin credentials (you can change these!)
    const adminEmail = 'admin@ecommerce.com';
    const adminPassword = 'AdminPassword123!';
    const adminName = 'Platform Administrator';

    // Check if an admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin account already exists! Skipping creation.');
      process.exit();
    }

    // Hash password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // Create admin user
    await User.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Admin account created successfully!');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    
    process.exit();
  } catch (error) {
    console.error(`Error seeding admin: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();