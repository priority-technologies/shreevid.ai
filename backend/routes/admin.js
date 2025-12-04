const express = require('express');
const User = require('../models/User');
const Project = require('../models/Project');
const Transaction = require('../models/Transaction');
const Usage = require('../models/Usage');
const adminAuth = require('../middleware/adminAuth');
const axios = require('axios');

const router = express.Router();

// ============================================
// USER MANAGEMENT
// ============================================

// Get all users with pagination and filters
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', sortBy = 'createdAt', order = 'desc' } = req.query;
    
    const query = search 
      ? { 
          $or: [
            { email: { $regex: search, $options: 'i' } },
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const users = await User.find(query)
      .select('-password -otpCode -resetToken')
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user details
router.get('/users/:userId', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password -otpCode -resetToken');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const projects = await Project.find({ userId: user._id }).sort({ createdAt: -1 });
    const transactions = await Transaction.find({ userId: user._id }).sort({ createdAt: -1 });
    const usage = await Usage.findOne({ userId: user._id });

    res.json({
      user,
      projects,
      transactions,
      usage
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user details
router.put('/users/:userId', adminAuth, async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;

    await user.save();

    res.json({
      message: 'User details updated successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Edit user details
router.put('/users/:userId', adminAuth, async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;

    await user.save();

    res.json({
      message: 'User details updated successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user credits
router.post('/users/:userId/credits', adminAuth, async (req, res) => {
  try {
    const { amount, action, reason } = req.body; // action: 'add' or 'deduct'
    
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (action === 'add') {
      await user.addCredits(amount, reason || 'Admin credit addition');
    } else if (action === 'deduct') {
      await user.deductCredits(amount, reason || 'Admin credit deduction');
    }

    // Create transaction record
    await Transaction.create({
      userId: user._id,
      type: action === 'add' ? 'credit_purchase' : 'credit_deduction',
      amount: action === 'add' ? amount : -amount,
      credits: amount,
      status: 'completed',
      description: reason || `Admin ${action} credits`,
      metadata: { adminAction: true, adminId: req.userId }
    });

    res.json({
      message: `Successfully ${action === 'add' ? 'added' : 'deducted'} ${amount} credits`,
      newBalance: user.credits
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle user admin status
router.post('/users/:userId/toggle-admin', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isAdmin = !user.isAdmin;
    await user.save();

    res.json({
      message: `User ${user.isAdmin ? 'granted' : 'revoked'} admin privileges`,
      isAdmin: user.isAdmin
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user
router.delete('/users/:userId', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete associated data
    await Project.deleteMany({ userId: user._id });
    await Transaction.deleteMany({ userId: user._id });
    await Usage.deleteOne({ userId: user._id });
    await user.deleteOne();

    res.json({ message: 'User and associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// PAYMENT & TRANSACTION MANAGEMENT
// ============================================

// Get all transactions
router.get('/transactions', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 50, paymentStatus, type } = req.query;
    
    const query = {};
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (type) query.type = type;

    const transactions = await Transaction.find(query)
      .populate('userId', 'email firstName lastName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(query);

    // Calculate revenue stats
    const revenueStats = await Transaction.aggregate([
      { $match: { paymentStatus: 'completed', type: 'purchase' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amountPaid' },
          totalTransactions: { $sum: 1 }
        }
      }
    ]);

    res.json({
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      stats: revenueStats[0] || { totalRevenue: 0, totalTransactions: 0 }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// PROJECT MANAGEMENT
// ============================================

// Get all projects
router.get('/projects', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 50, videoStatus } = req.query;
    
    const query = videoStatus ? { videoStatus } : {};

    const projects = await Project.find(query)
      .populate('userId', 'email firstName lastName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Project.countDocuments(query);

    res.json({
      projects,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// API USAGE & BILLS
// ============================================

// Get RunwayML API credits/usage
router.get('/api-usage/runway', adminAuth, async (req, res) => {
  try {
    const response = await axios.get(`${process.env.RUNWAY_API_BASE_URL}/account`, {
      headers: {
        'Authorization': `Bearer ${process.env.RUNWAY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.json({
      provider: 'RunwayML',
      data: response.data
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch RunwayML usage',
      details: error.response?.data || error.message 
    });
  }
});

// Get Google Cloud TTS usage estimate
router.get('/api-usage/google-tts', adminAuth, async (req, res) => {
  try {
    // Calculate based on projects
    const projects = await Project.find({ status: 'completed' });
    const totalCharacters = projects.reduce((sum, p) => sum + (p.script?.length || 0), 0);
    
    // Google TTS pricing: ~$4 per 1 million characters
    const estimatedCost = (totalCharacters / 1000000) * 4;

    res.json({
      provider: 'Google Cloud Text-to-Speech',
      totalProjects: projects.length,
      totalCharacters,
      estimatedCostUSD: estimatedCost.toFixed(2),
      note: 'Estimate based on completed projects'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get combined API usage summary
router.get('/api-usage/summary', adminAuth, async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments({ status: 'completed' });
    const totalUsers = await User.countDocuments();
    const totalRevenue = await Transaction.aggregate([
      { $match: { status: 'completed', type: 'credit_purchase' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      totalProjects,
      totalUsers,
      totalRevenue: totalRevenue[0]?.total || 0,
      apis: {
        runway: { status: 'active', provider: 'RunwayML Gen-4 Turbo' },
        googleTTS: { status: 'active', provider: 'Google Cloud TTS' },
        ffmpeg: { status: 'active', provider: 'FFmpeg (Local)' }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// DASHBOARD STATS
// ============================================

// Get admin dashboard overview
router.get('/dashboard/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProjects = await Project.countDocuments();
    const completedProjects = await Project.countDocuments({ videoStatus: 'completed' });
    const pendingProjects = await Project.countDocuments({ videoStatus: { $in: ['pending', 'processing', 'generating'] } });
    
    const revenueData = await Transaction.aggregate([
      { $match: { paymentStatus: 'completed', type: 'purchase' } },
      { $group: { _id: null, total: { $sum: '$amountPaid' } } }
    ]);
    
    const creditsData = await User.aggregate([
      { $group: { 
        _id: null, 
        totalCreditsIssued: { $sum: '$totalCreditsEarned' },
        totalCreditsSpent: { $sum: '$totalCreditsSpent' },
        totalCreditsAvailable: { $sum: '$credits' }
      }}
    ]);

    // Recent activity
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('email firstName lastName createdAt');
    const recentProjects = await Project.find().populate('userId', 'email firstName').sort({ createdAt: -1 }).limit(5);

    res.json({
      users: {
        total: totalUsers,
        recent: recentUsers
      },
      projects: {
        total: totalProjects,
        completed: completedProjects,
        pending: pendingProjects,
        recent: recentProjects
      },
      revenue: {
        total: revenueData[0]?.total || 0,
        currency: 'INR'
      },
      credits: creditsData[0] || {
        totalCreditsIssued: 0,
        totalCreditsSpent: 0,
        totalCreditsAvailable: 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
