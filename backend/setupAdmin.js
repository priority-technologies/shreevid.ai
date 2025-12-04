// Quick Admin Setup Script
// Creates a test admin user automatically

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const adminData = {
  email: 'admin@shreevid.ai',
  password: 'admin123',
  firstName: 'Super',
  lastName: 'Admin',
  isAdmin: true,
  isVerified: true,
  credits: 10000
};

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB\n');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Admin: ${existingAdmin.isAdmin}`);
      
      // Update to ensure admin status
      existingAdmin.isAdmin = true;
      await existingAdmin.save();
      console.log('✅ Updated admin status\n');
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash(adminData.password, 10);
      
      const admin = new User({
        ...adminData,
        password: hashedPassword
      });
      
      await admin.save();
      
      console.log('✅ Admin user created successfully!\n');
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔐 ADMIN LOGIN CREDENTIALS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Email:    ${adminData.email}`);
    console.log(`   Password: ${adminData.password}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📝 Login Steps:');
    console.log('   1. Go to: http://localhost:5173/login');
    console.log('   2. Login with above credentials');
    console.log('   3. Click "👑 Admin" button in top right');
    console.log('   4. Or go directly to: http://localhost:5173/admin\n');
    
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
