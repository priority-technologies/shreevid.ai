require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI;

async function listAllUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    const users = await User.find({}).select('-password -otpCode -resetToken');
    
    console.log(`📊 Total users in database: ${users.length}\n`);

    if (users.length === 0) {
      console.log('✅ Database is completely clean - no users exist!\n');
    } else {
      console.log('⚠️  Users still exist in database:\n');
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email}`);
        console.log(`   Name: ${user.firstName} ${user.lastName}`);
        console.log(`   ID: ${user._id}`);
        console.log(`   isAdmin: ${user.isAdmin || false}`);
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

listAllUsers();
