require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Transaction = require('./models/Transaction');

async function createAccount() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if user already exists
    let user = await User.findOne({ email: 'priorityassociates8@gmail.com' });
    
    if (user) {
      console.log('User already exists! Updating credentials...\n');
      // Update password
      const hashedPassword = await bcrypt.hash('Priority@2025', 10);
      user.password = hashedPassword;
      user.isAdmin = true;
      user.role = 'admin';
      user.credits = 125;
      user.totalCreditsEarned = 380;
      user.totalCreditsSpent = 255;
      await user.save();
    } else {
      console.log('Creating new user account...\n');
      const hashedPassword = await bcrypt.hash('Priority@2025', 10);
      user = await User.create({
        email: 'priorityassociates8@gmail.com',
        password: hashedPassword,
        firstName: 'Prankur',
        lastName: 'Atre',
        isVerified: true,
        isAdmin: true,
        role: 'admin',
        credits: 125,
        totalCreditsEarned: 380,
        totalCreditsSpent: 255
      });

      // Create sample transactions to match the screenshots
      const transactions = [
        { type: 'deduction', amount: 65, desc: 'Video generation' },
        { type: 'refund', amount: 65, desc: 'Refund - Video generation failed' },
        { type: 'deduction', amount: 65, desc: 'Video generation' },
        { type: 'refund', amount: 65, desc: 'Refund - Video generation failed' },
        { type: 'refund', amount: 125, desc: 'Refund - Video generation failed' },
        { type: 'deduction', amount: 125, desc: 'Video generation' }
      ];

      let balance = 125; // Starting balance
      for (const txn of transactions) {
        const balanceBefore = balance;
        if (txn.type === 'deduction') {
          balance -= txn.amount;
        } else {
          balance += txn.amount;
        }

        await Transaction.create({
          userId: user._id,
          type: txn.type,
          amount: txn.amount,
          balanceBefore: balanceBefore,
          balanceAfter: balance,
          description: txn.desc
        });
      }
    }

    console.log('✅ Account created/updated successfully!\n');
    console.log('═══════════════════════════════════════');
    console.log('📧 Email:    priorityassociates8@gmail.com');
    console.log('🔐 Password: Priority@2025');
    console.log('👑 Admin:    YES');
    console.log('💰 Credits:  125');
    console.log('═══════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAccount();
