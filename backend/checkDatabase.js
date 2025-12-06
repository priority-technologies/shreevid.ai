require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

async function checkDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');
    
    const dbName = mongoose.connection.db.databaseName;
    console.log(`📊 Current Database: ${dbName}\n`);
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`Collections in database "${dbName}":`);
    
    for (const coll of collections) {
      const count = await mongoose.connection.db.collection(coll.name).countDocuments();
      console.log(`   - ${coll.name}: ${count} documents`);
    }
    
    console.log('\n');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

checkDatabase();
