require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to Database...');

    // Check if the admin already exists so we don't duplicate
    const existing = await User.findOne({ email: 'admin@changeability.org' });
    if (existing) {
      console.log('Admin already exists!');
      process.exit(0);
    }

    // Hash the password and create the master admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await User.create({
      email: 'admin@changeability.org',
      password: hashedPassword,
      role: 'Admin',
      status: 'Active'
    });

    console.log('Success! Admin account created.');
    console.log('Email: admin@changeability.org');
    console.log('Password: ------');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();