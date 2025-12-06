require('dotenv').config({ path: '.env.production' });
const mongoose = require('mongoose');
const User = require('./models/User');

const ADMIN_EMAILS = [
  'info@prioritytechnologiess.com',
  'priorityassociates8@gmail.com',
  'rupaliatre8@gmail.com',
  'prax420@gmail.com'
];

async function setAdminUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    for (const email of ADMIN_EMAILS) {
      const result = await User.updateOne(
        { email: email.toLowerCase() },
        { $set: { isAdmin: true } }
      );

      if (result.matchedCount > 0) {
        console.log(`✅ Set admin privileges for: ${email}`);
      } else {
        console.log(`⚠️  User not found: ${email} (will be set when they sign up)`);
      }
    }

    console.log('\n✅ Admin setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setAdminUsers();
