// Create sample data for admin panel testing
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const Project = require('./models/Project');

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB\n');
    console.log('Creating sample data...\n');
    
    // Create 5 sample users
    const sampleUsers = [];
    for (let i = 1; i <= 5; i++) {
      let user = await User.findOne({ email: `user${i}@test.com` });
      
      if (!user) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        user = await User.create({
          email: `user${i}@test.com`,
          password: hashedPassword,
          firstName: `User${i}`,
          lastName: `Test`,
          isVerified: true,
          credits: Math.floor(Math.random() * 500) + 100,
          totalCreditsEarned: Math.floor(Math.random() * 1000) + 500,
          totalCreditsSpent: Math.floor(Math.random() * 300) + 50
        });
      }
      sampleUsers.push(user);
    }
    console.log(`✅ Loaded/Created ${sampleUsers.length} sample users`);
    
    // Create sample transactions
    let txnCount = 0;
    for (const user of sampleUsers) {
      // Credit purchase
      await Transaction.create({
        userId: user._id,
        type: 'purchase',
        amount: 500,
        balanceBefore: user.credits - 500,
        balanceAfter: user.credits,
        description: 'Credit package purchase - 500 credits',
        paymentMethod: 'credit_card',
        paymentStatus: 'completed',
        amountPaid: 500,
        currency: 'INR'
      });
      
      // Video generation deduction
      await Transaction.create({
        userId: user._id,
        type: 'deduction',
        amount: 50,
        balanceBefore: user.credits + 50,
        balanceAfter: user.credits,
        description: 'Video generation - AI powered video',
        paymentStatus: 'completed'
      });
      
      txnCount += 2;
    }
    console.log(`✅ Created ${txnCount} sample transactions`);
    
    // Create sample projects
    let projCount = 0;
    const statuses = ['completed', 'processing', 'pending', 'failed'];
    
    for (const user of sampleUsers) {
      const numProjects = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < numProjects; i++) {
        await Project.create({
          userId: user._id,
          title: `AI Video Project ${i + 1}`,
          prompt: `Create an engaging video about ${['technology', 'nature', 'business', 'education'][Math.floor(Math.random() * 4)]}`,
          imageUrl: `https://picsum.photos/1920/1080?random=${Math.random()}`,
          thumbnailUrl: `https://picsum.photos/400/300?random=${Math.random()}`,
          videoUrl: statuses[Math.floor(Math.random() * statuses.length)] === 'completed' ? 
            `https://sample-videos.com/video123.mp4` : null,
          videoStatus: statuses[Math.floor(Math.random() * statuses.length)],
          duration: Math.floor(Math.random() * 30) + 10,
          costCredits: Math.floor(Math.random() * 50) + 10
        });
        projCount++;
      }
    }
    console.log(`✅ Created ${projCount} sample projects\n`);
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ SAMPLE DATA CREATED SUCCESSFULLY!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Users: ${sampleUsers.length}`);
    console.log(`   Transactions: ${txnCount}`);
    console.log(`   Projects: ${projCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🎯 Now login to admin panel and explore!\n');
    
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
