// src/seed.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {User,Role} from './models/User';
import bcrypt from 'bcryptjs';

dotenv.config();
const seedDB = async () => {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGODB_URL!);

    // Check if admin user already exists
    const adminUser = await User.findOne({ role: Role.Admin });
    if (!adminUser) {
      // Create admin user
      const newAdmin = new User({
        userName: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
        name:process.env.ADMIN_NAME,
        role: Role.Admin,
      });
      await newAdmin.save();
      console.log('Admin user created.');
    } else {
      console.log('Admin user already exists.');
    }

    // Close the connection
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

seedDB();
