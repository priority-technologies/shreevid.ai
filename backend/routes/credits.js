const express = require('express');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { verifyToken } = require('../middleware/auth');
const { CREDIT_PACKAGES } = require('../config/credits');

const router = express.Router();

// GET CREDIT BALANCE
router.get('/balance', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('credits totalCreditsEarned totalCreditsSpent');
    res.json({
      credits: user.credits,
      totalEarned: user.totalCreditsEarned,
      totalSpent: user.totalCreditsSpent,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET PRICING PLANS
router.get('/pricing', async (req, res) => {
  try {
    res.json(CREDIT_PACKAGES);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET TRANSACTION HISTORY
router.get('/transactions', verifyToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const transactions = await Transaction.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('projectId', 'prompt videoStatus');
    
    const count = await Transaction.countDocuments({ userId: req.userId });
    
    res.json({
      transactions,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalTransactions: count,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PURCHASE CREDITS (Manual/Admin for now - will integrate Stripe/Razorpay later)
router.post('/purchase', verifyToken, async (req, res) => {
  try {
    const { packageId, paymentMethod = 'manual', paymentId } = req.body;
    
    // Find the package
    const package = CREDIT_PACKAGES.find(p => p.id === packageId);
    if (!package) {
      return res.status(400).json({ error: 'Invalid package' });
    }
    
    // Get user
    const user = await User.findById(req.userId);
    const balanceBefore = user.credits;
    
    // Add credits
    await user.addCredits(package.credits, `Purchased ${package.name}`);
    
    // Log transaction
    const transaction = new Transaction({
      userId: req.userId,
      type: 'purchase',
      amount: package.credits,
      balanceBefore,
      balanceAfter: user.credits,
      description: `Purchased ${package.name} - ${package.credits} credits`,
      paymentMethod,
      paymentId: paymentId || `MANUAL-${Date.now()}`,
      paymentStatus: 'completed',
      amountPaid: package.price,
      currency: 'USD',
    });
    await transaction.save();
    
    res.json({
      success: true,
      message: `Successfully purchased ${package.credits} credits!`,
      package: package.name,
      creditsAdded: package.credits,
      newBalance: user.credits,
      transactionId: transaction._id,
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADMIN: Add bonus credits to user
router.post('/admin/add-credits', verifyToken, async (req, res) => {
  try {
    const { userId, amount, reason } = req.body;
    
    // TODO: Add admin verification middleware
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const balanceBefore = user.credits;
    await user.addCredits(amount, reason || 'Admin bonus');
    
    // Log transaction
    const transaction = new Transaction({
      userId,
      type: 'bonus',
      amount,
      balanceBefore,
      balanceAfter: user.credits,
      description: reason || 'Admin bonus credits',
      paymentMethod: 'manual',
      paymentStatus: 'completed',
    });
    await transaction.save();
    
    res.json({
      success: true,
      message: `Added ${amount} credits to user ${user.email}`,
      newBalance: user.credits,
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
