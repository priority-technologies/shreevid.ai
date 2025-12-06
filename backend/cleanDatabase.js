require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
const Transaction = require('./models/Transaction');
const Usage = require('./models/Usage');

const MONGODB_URI = process.env.MONGODB_URI;

async function cleanDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    console.log('⚠️  WARNING: This will DELETE ALL DATA from the database!');
    console.log('═══════════════════════════════════════════════════════\n');

    // Count existing data
    const userCount = await User.countDocuments();
    const projectCount = await Project.countDocuments();
    const transactionCount = await Transaction.countDocuments();
    const usageCount = await Usage.countDocuments();

    console.log('📊 Current Database Contents:');
    console.log(`   Users: ${userCount}`);
    console.log(`   Projects: ${projectCount}`);
    console.log(`   Transactions: ${transactionCount}`);
    console.log(`   Usage Records: ${usageCount}`);
    console.log('');

    if (userCount === 0 && projectCount === 0 && transactionCount === 0 && usageCount === 0) {
      console.log('✓ Database is already empty!\n');
      await mongoose.connection.close();
      process.exit(0);
      return;
    }

    console.log('🗑️  Deleting all data...\n');

    // Delete all data
    const userResult = await User.deleteMany({});
    const projectResult = await Project.deleteMany({});
    const transactionResult = await Transaction.deleteMany({});
    const usageResult = await Usage.deleteMany({});

    console.log('✅ Database Cleaned Successfully!');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`   ✓ Deleted ${userResult.deletedCount} users`);
    console.log(`   ✓ Deleted ${projectResult.deletedCount} projects`);
    console.log(`   ✓ Deleted ${transactionResult.deletedCount} transactions`);
    console.log(`   ✓ Deleted ${usageResult.deletedCount} usage records`);
    console.log('═══════════════════════════════════════════════════════\n');

    console.log('✨ Database is now clean and ready for fresh accounts!\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

cleanDatabase();
