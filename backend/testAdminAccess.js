require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI;

async function testAdminAccess(email) {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log(`✗ User with email ${email} not found!`);
      process.exit(1);
    }

    console.log('\n📋 USER DETAILS FROM DATABASE:');
    console.log('─────────────────────────────────────────');
    console.log(`Name: ${user.firstName} ${user.lastName}`);
    console.log(`Email: ${user.email}`);
    console.log(`User ID: ${user._id}`);
    console.log(`isAdmin: ${user.isAdmin}`);
    console.log(`role: ${user.role || 'NOT SET'}`);
    console.log(`isVerified: ${user.isVerified}`);
    console.log(`Credits: ${user.credits}`);
    console.log('─────────────────────────────────────────');

    console.log('\n🔍 ADMIN CHECK:');
    if (user.isAdmin === true) {
      console.log('✅ user.isAdmin === true');
    } else {
      console.log('❌ user.isAdmin === false or undefined');
      console.log(`   Actual value: ${JSON.stringify(user.isAdmin)}`);
    }

    console.log('\n📦 RAW DOCUMENT:');
    console.log(JSON.stringify(user.toObject(), null, 2));

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

const emailToCheck = process.argv[2] || 'priorityassociates8@gmail.com';
testAdminAccess(emailToCheck);
