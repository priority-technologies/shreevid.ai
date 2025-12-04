require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const billingRoutes = require('./routes/billing');
const creditsRoutes = require('./routes/credits');
const paymentRoutes = require('./routes/payment');
const testRoutes = require('./routes/test');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/credits', creditsRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/test', testRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Shreevid AI Backend running on http://localhost:${PORT}`);
  console.log(`\n📡 Available endpoints:`);
  console.log(`   ✅ Authentication`);
  console.log(`      - POST   /api/auth/signup`);
  console.log(`      - POST   /api/auth/login`);
  console.log(`      - POST   /api/auth/forgot-password`);
  console.log(`\n   ✅ Video Generation (REAL - RunwayML + Google TTS + FFmpeg)`);
  console.log(`      - POST   /api/projects/create`);
  console.log(`      - GET    /api/projects/my-projects`);
  console.log(`      - GET    /api/projects/status/:projectId`);
  console.log(`      - GET    /api/projects/admin/stats`);
  console.log(`\n   ✅ Credits (Prepaid System)`);
  console.log(`      - GET    /api/credits/balance`);
  console.log(`      - GET    /api/credits/pricing`);
  console.log(`      - GET    /api/credits/transactions`);
  console.log(`      - POST   /api/credits/purchase`);
  console.log(`\n   ✅ Billing (Legacy)`);
  console.log(`      - GET    /api/billing/history`);
  console.log(`      - POST   /api/billing/pay`);
  console.log(`\n   ✅ Testing`);
  console.log(`      - GET    /api/test/health`);
  console.log(`      - GET    /api/test/stats`);
  console.log(`      - POST   /api/test/test-tts (test Google TTS)`);
  console.log(`      - GET    /api/test/runway-credits (check RunwayML credits)`);
  console.log(`\n`);
});

module.exports = app;

