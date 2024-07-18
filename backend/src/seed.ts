// src/seed.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {User,Role} from './models/User';
import bcrypt from 'bcryptjs';

dotenv.config();
const seedDB = async () => {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGODB_URI!);

    // Check if admin user already exists
    const adminUser = await User.findOne({ role: Role.Admin });
    if (!adminUser) {
      // Create admin user
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);
      const newAdmin = new User({
        username: process.env.ADMIN_USERNAME,
        password: hashedPassword,
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
