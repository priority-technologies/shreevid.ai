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

async function checkUser(email) {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('\n✓ Connected to MongoDB\n');

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log(`─────────────────────────────────────────`);
      console.log(`✗ Account NOT FOUND`);
      console.log(`─────────────────────────────────────────`);
      console.log(`Email: ${email}`);
      console.log(`Status: No account exists with this email`);
      console.log(`\nTo create this account:`);
      console.log(`1. Go to: https://shreevid.prioritytechnologiess.com/#/signup`);
      console.log(`2. Sign up with: ${email}`);
      console.log(`3. It will automatically be an Admin account!\n`);
    } else {
      const isInAdminList = ADMIN_EMAILS.includes(email.toLowerCase());
      const hasAdminFlag = user.isAdmin === true;
      const hasAdminRole = user.role === 'admin';
      
      console.log(`─────────────────────────────────────────`);
      console.log(`✓ ACCOUNT FOUND`);
      console.log(`─────────────────────────────────────────`);
      console.log(`Name: ${user.firstName} ${user.lastName}`);
      console.log(`Email: ${user.email}`);
      console.log(`Credits: ${user.credits}`);
      console.log(`Created: ${new Date(user.createdAt).toLocaleString()}`);
      console.log(`\n─── ADMIN STATUS ───`);
      console.log(`In Admin Email List: ${isInAdminList ? '✓ YES' : '✗ NO'}`);
      console.log(`Has Admin Flag: ${hasAdminFlag ? '✓ YES' : '✗ NO'}`);
      console.log(`Has Admin Role: ${hasAdminRole ? '✓ YES' : '✗ NO'}`);
      
      if (isInAdminList || hasAdminFlag || hasAdminRole) {
        console.log(`\n✓ This account HAS Super Admin access!`);
        console.log(`  Access admin panel at: https://shreevid.prioritytechnologiess.com/#/admin\n`);
      } else {
        console.log(`\n✗ This account is a REGULAR user`);
        console.log(`  To promote to admin, run:`);
        console.log(`  node promoteToAdmin.js ${email}\n`);
      }
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

const emailToCheck = process.argv[2];

if (!emailToCheck) {
  console.log('\n────────────────────────────────────────────────');
  console.log('  SHREEVID AI - USER ADMIN STATUS CHECKER');
  console.log('────────────────────────────────────────────────\n');
  console.log('Usage: node checkAdminStatus.js <email>\n');
  console.log('Example: node checkAdminStatus.js priorityassociates8@gmail.com\n');
  console.log('Pre-configured Admin Emails:');
  ADMIN_EMAILS.forEach(email => console.log(`  • ${email}`));
  console.log('');
  process.exit(1);
}

checkUser(emailToCheck);
