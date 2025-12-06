require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const Project = require('./models/Project');

async function resetUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const user = await User.findOne({ email: 'priorityassociates8@gmail.com' });
    
    if (!user) {
      console.log('❌ User not found!');
      process.exit(1);
    }

    console.log('📊 Current User Data:');
    console.log('Credits:', user.credits);
    console.log('Total Earned:', user.totalCreditsEarned);
    console.log('Total Spent:', user.totalCreditsSpent);

    // Count transactions and projects
    const txnCount = await Transaction.countDocuments({ userId: user._id });
    const projectCount = await Project.countDocuments({ userId: user._id });
    
    console.log('Transactions:', txnCount);
    console.log('Projects:', projectCount);

    // Reset to fresh new user state
    user.credits = 125;
    user.totalCreditsEarned = 125;  // Only initial signup bonus
    user.totalCreditsSpent = 0;     // No videos created yet
    await user.save();

    // Delete all transactions
    await Transaction.deleteMany({ userId: user._id });
    
    // Delete all projects
    await Project.deleteMany({ userId: user._id });

    console.log('\n✅ User reset to new account state!');
    console.log('\n📊 New User Data:');
    console.log('Credits: 125');
    console.log('Total Earned: 125');
    console.log('Total Spent: 0');
    console.log('Transactions: 0');
    console.log('Projects: 0');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetUser();
