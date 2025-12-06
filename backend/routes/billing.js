const express = require('express');
const Billing = require('../models/Billing');
const Usage = require('../models/Usage');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// GET BILLING HISTORY
router.get('/history', verifyToken, async (req, res) => {
  try {
    const { filter = 'all', month, year } = req.query;

    let query = { userId: req.userId };

    if (filter === 'monthly' && month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      query.billingDate = { $gte: startDate, $lte: endDate };
    } else if (filter === 'daily') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      query.billingDate = { $gte: today, $lt: tomorrow };
    }

    const billings = await Billing.find(query).sort({ billingDate: -1 });

    const totalAmount = billings.reduce((sum, b) => sum + b.amount, 0);
    const totalCredits = billings.reduce((sum, b) => sum + b.creditsUsed, 0);
    const paidAmount = billings.filter(b => b.isPaid).reduce((sum, b) => sum + b.amount, 0);
    const pendingAmount = billings.filter(b => !b.isPaid).reduce((sum, b) => sum + b.amount, 0);

    res.json({
      billings,
      summary: {
        totalAmount,
        totalCredits,
        paidAmount,
        pendingAmount,
        billCount: billings.length,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET USAGE STATS
router.get('/usage', verifyToken, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.userId);
    const usage = await Usage.findOne({ userId: req.userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      totalCreditsUsed: user.totalCreditsSpent || 0,
      creditsRemaining: user.credits || 0,
      totalCreditsEarned: user.totalCreditsEarned || 0,
      monthlyUsage: usage?.monthlyUsage || 0,
      dailyUsage: usage?.dailyUsage || 0,
      videoGenerationCount: usage?.videoGenerationCount || 0,
      voiceEditingCount: usage?.voiceEditingCount || 0,
      lastResetDate: usage?.lastResetDate || user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PROCESS PAYMENT (Mock)
router.post('/pay', verifyToken, async (req, res) => {
  try {
    const { billingId, amount, paymentMethod, cardDetails } = req.body;

    if (!billingId || !amount || !paymentMethod) {
      return res.status(400).json({ error: 'Missing payment details' });
    }

    const billing = await Billing.findOne({ _id: billingId, userId: req.userId });
    if (!billing) {
      return res.status(404).json({ error: 'Billing record not found' });
    }

    // Mock payment processing
    const isPaymentSuccess = Math.random() > 0.1; // 90% success rate in mock

    if (isPaymentSuccess) {
      billing.isPaid = true;
      billing.paymentStatus = 'success';
      billing.paymentMethod = paymentMethod;
      await billing.save();

      res.json({
        message: 'Payment successful',
        transactionId: billing.transactionId,
        status: 'success',
        amount,
      });
    } else {
      billing.paymentStatus = 'failed';
      await billing.save();

      res.status(400).json({
        message: 'Payment failed. Please try again.',
        transactionId: billing.transactionId,
        status: 'failed',
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET PENDING BILLS
router.get('/pending', verifyToken, async (req, res) => {
  try {
    const pendingBills = await Billing.find({ userId: req.userId, isPaid: false }).sort({
      billingDate: -1,
    });

    const totalPending = pendingBills.reduce((sum, b) => sum + b.amount, 0);

    res.json({
      pendingBills,
      totalPending,
      billCount: pendingBills.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
