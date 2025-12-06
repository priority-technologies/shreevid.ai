require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI;

async function searchUser(emailQuery) {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Search case-insensitive
    const users = await User.find({ 
      email: { $regex: new RegExp(emailQuery, 'i') } 
    }).select('-password');
    
    console.log(`Found ${users.length} user(s) matching "${emailQuery}":\n`);

    if (users.length === 0) {
      console.log('❌ No users found\n');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. EMAIL: ${user.email}`);
        console.log('─────────────────────────────────────────');
        console.log(`   Name: ${user.firstName} ${user.lastName}`);
        console.log(`   User ID: ${user._id}`);
        console.log(`   isAdmin: ${user.isAdmin || false}`);
        console.log(`   role: ${user.role || 'NOT SET'}`);
        console.log(`   Credits: ${user.credits}`);
        console.log(`   Auth Provider: ${user.authProvider}`);
        console.log(`   Created: ${new Date(user.createdAt).toLocaleString()}`);
        console.log('');
      });
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

const emailQuery = process.argv[2] || 'priority';
searchUser(emailQuery);
