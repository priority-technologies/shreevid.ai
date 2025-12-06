require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI;

async function findAllAdmins() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    const admins = await User.find({ isAdmin: true }).select('-password');
    
    console.log('═══════════════════════════════════════════════════════');
    console.log(`      FOUND ${admins.length} ADMIN ACCOUNT(S)`);
    console.log('═══════════════════════════════════════════════════════\n');

    if (admins.length === 0) {
      console.log('❌ No admin accounts found in database\n');
    } else {
      admins.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email}`);
        console.log('─────────────────────────────────────────');
        console.log(`   Name: ${user.firstName} ${user.lastName}`);
        console.log(`   isAdmin: ${user.isAdmin}`);
        console.log(`   role: ${user.role || 'NOT SET'}`);
        console.log(`   Credits: ${user.credits}`);
        console.log(`   Auth Provider: ${user.authProvider}`);
        console.log(`   Created: ${new Date(user.createdAt).toLocaleString()}`);
        console.log('');
      });
    }

    console.log('═══════════════════════════════════════════════════════\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

findAllAdmins();
