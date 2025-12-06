require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI;

async function promoteUserToAdmin(email) {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log(`✗ User with email ${email} not found!`);
      process.exit(1);
    }

    user.isAdmin = true;
    user.role = 'admin';
    await user.save();

    console.log(`✓ User ${email} has been promoted to Admin!`);
    console.log(`  Name: ${user.firstName} ${user.lastName}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Role: ${user.role}`);
    console.log(`  Is Admin: ${user.isAdmin}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

// Get email from command line argument
const emailToPromote = process.argv[2];

if (!emailToPromote) {
  console.log('Usage: node promoteToAdmin.js <email>');
  console.log('Example: node promoteToAdmin.js user@example.com');
  process.exit(1);
}

promoteUserToAdmin(emailToPromote);
