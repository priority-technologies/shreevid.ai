// Script to make a user an admin
// Usage: node makeAdmin.js user@email.com

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const email = process.argv[2];

if (!email) {
  console.log('❌ Please provide an email address');
  console.log('Usage: node makeAdmin.js user@email.com');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`❌ User not found: ${email}`);
      process.exit(1);
    }

    user.isAdmin = true;
    await user.save();

    console.log(`\n✅ Successfully granted admin privileges to: ${email}`);
    console.log(`   User: ${user.firstName} ${user.lastName}`);
    console.log(`   Admin: ${user.isAdmin}`);
    console.log(`\n🔐 You can now access the admin panel at: http://localhost:5173/admin\n`);
    
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
