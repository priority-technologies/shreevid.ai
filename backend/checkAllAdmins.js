require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI;

const ADMIN_EMAILS = [
  'info@prioritytechnologiess.com',
  'priorityassociates8@gmail.com',
  'rupaliatre8@gmail.com',
  'prax420@gmail.com'
];

async function checkAllAdmins() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    console.log('═══════════════════════════════════════════════════════');
    console.log('           CHECKING ALL ADMIN ACCOUNTS');
    console.log('═══════════════════════════════════════════════════════\n');

    for (const email of ADMIN_EMAILS) {
      const user = await User.findOne({ email: email.toLowerCase() });
      
      console.log(`📧 ${email}`);
      console.log('─────────────────────────────────────────');
      
      if (!user) {
        console.log('❌ Account does NOT exist\n');
        continue;
      }

      console.log(`✓ Account exists`);
      console.log(`   Name: ${user.firstName} ${user.lastName}`);
      console.log(`   isAdmin: ${user.isAdmin ? '✅ YES' : '❌ NO'}`);
      console.log(`   role: ${user.role || '❌ NOT SET'}`);
      console.log(`   Credits: ${user.credits}`);
      console.log(`   Created: ${new Date(user.createdAt).toLocaleString()}`);
      console.log('');
    }

    console.log('═══════════════════════════════════════════════════════\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

checkAllAdmins();
