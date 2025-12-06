require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.RUNWAYML_API_KEY || process.env.RUNWAY_API_KEY;
const API_BASE = 'https://api.dev.runwayml.com/v1';

console.log('🔍 RunwayML API Diagnostic Tool\n');
console.log('═══════════════════════════════════════════════════════════════\n');

async function diagnose() {
  // 1. Check API Key
  console.log('1️⃣ Checking API Key...');
  if (!API_KEY) {
    console.log('❌ No API key found in environment variables');
    return;
  }
  console.log('✅ API Key found:', API_KEY.substring(0, 20) + '...');
  console.log('   Length:', API_KEY.length, 'characters\n');

  const client = axios.create({
    baseURL: API_BASE,
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'X-Runway-Version': '2024-11-06'
    }
  });

  try {
    // 2. Check Organization Info
    console.log('2️⃣ Fetching Organization Info...');
    const orgResponse = await client.get('/organization');
    const org = orgResponse.data;
    
    console.log('✅ Organization retrieved successfully');
    console.log('   Credit Balance:', org.creditBalance);
    console.log('   Tier:', org.tier ? 'Custom' : 'Standard');
    
    if (org.tier) {
      console.log('   Max Monthly Credit Spend:', org.tier.maxMonthlyCreditSpend);
      console.log('\n   Model Limits (gen4_turbo):');
      if (org.tier.models?.gen4_turbo) {
        console.log('     - Max Concurrent:', org.tier.models.gen4_turbo.maxConcurrentGenerations);
        console.log('     - Max Daily:', org.tier.models.gen4_turbo.maxDailyGenerations);
      }
    }

    console.log('\n   Today\'s Usage:');
    if (org.usage?.models?.gen4_turbo) {
      console.log('     - gen4_turbo:', org.usage.models.gen4_turbo.dailyGenerations, 'generations');
    }
    if (org.usage?.models?.gen3a_turbo) {
      console.log('     - gen3a_turbo:', org.usage.models.gen3a_turbo.dailyGenerations, 'generations');
    }
    console.log('');

    // 3. Test Image Upload with minimal request
    console.log('3️⃣ Testing Video Generation Request...');
    
    // Use a simple test image (1x1 pixel PNG)
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const imageDataUri = `data:image/png;base64,${testImageBase64}`;

    const payload = {
      promptImage: imageDataUri,
      model: 'gen4_turbo',
      promptText: 'A simple test video',
      duration: 5,
      ratio: '1280:720',
      seed: 12345
    };

    console.log('   Payload:');
    console.log('     - Model:', payload.model);
    console.log('     - Duration:', payload.duration, 'seconds');
    console.log('     - Ratio:', payload.ratio);
    console.log('     - Prompt:', payload.promptText);
    console.log('     - Image:', 'Base64 encoded (' + testImageBase64.length + ' chars)');
    
    try {
      const response = await client.post('/image_to_video', payload);
      console.log('\n✅ Request accepted! Task ID:', response.data.id);
      console.log('   Status:', response.data.status || 'PENDING');
      
      if (response.data.progress !== undefined) {
        console.log('   Progress:', response.data.progress);
      }

      // 4. Try to poll the task
      console.log('\n4️⃣ Checking Task Status...');
      const taskId = response.data.id;
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      
      const taskResponse = await client.get(`/tasks/${taskId}`);
      const task = taskResponse.data;
      
      console.log('   Task Status:', task.status);
      if (task.failure) {
        console.log('   ❌ Failure Reason:', task.failure.message || task.failureReason);
        console.log('   Full Response:', JSON.stringify(task, null, 2));
      } else if (task.status === 'RUNNING') {
        console.log('   ⏳ Task is processing...');
      } else if (task.status === 'SUCCEEDED') {
        console.log('   ✅ Task succeeded!');
        console.log('   Video URL:', task.output?.[0] || 'Not available');
      }

    } catch (genError) {
      console.log('\n❌ Generation Request Failed');
      if (genError.response) {
        console.log('   Status Code:', genError.response.status);
        console.log('   Error Message:', genError.response.data?.message || genError.response.statusText);
        console.log('   Full Response:', JSON.stringify(genError.response.data, null, 2));
      } else {
        console.log('   Error:', genError.message);
      }
    }

  } catch (error) {
    console.log('\n❌ API Request Failed');
    if (error.response) {
      console.log('   Status Code:', error.response.status);
      console.log('   Status Text:', error.response.statusText);
      console.log('   Response Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('   Error:', error.message);
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('Diagnostic Complete!\n');
  console.log('Please share these results along with screenshots from RunwayML');
  console.log('dashboard for collaborative diagnosis.\n');
}

diagnose().then(() => process.exit(0)).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
