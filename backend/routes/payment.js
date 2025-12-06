const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { CREDIT_COSTS } = require('../config/credits');
const { processPayment, validatePaymentDetails } = require('../config/mockPayment');
const { verifyToken } = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Get payment methods available
 */
router.get('/methods', verifyToken, (req, res) => {
  const methods = [
    {
      id: 'credit_card',
      name: 'Credit Card',
      icon: '💳',
      description: 'Visa, Mastercard, American Express',
      processingTime: '2-3 seconds',
    },
    {
      id: 'debit_card',
      name: 'Debit Card',
      icon: '💳',
      description: 'All major debit cards',
      processingTime: '2-3 seconds',
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: '📱',
      description: 'Google Pay, PhonePe, Paytm',
      processingTime: '1-2 seconds',
      region: 'India',
    },
    {
      id: 'net_banking',
      name: 'Net Banking',
      icon: '🏦',
      description: 'All major Indian banks',
      processingTime: '3-5 seconds',
      region: 'India',
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: '🅿️',
      description: 'Fast and secure international payments',
      processingTime: '2-3 seconds',
    },
    {
      id: 'stripe',
      name: 'Stripe',
      icon: '💰',
      description: 'Global payment platform',
      processingTime: '2-3 seconds',
    },
  ];

  res.json(methods);
});

/**
 * Process mock payment and add credits
 * POST /api/payment/process
 */
router.post('/process', verifyToken, async (req, res) => {
  try {
    const { method, amount, paymentDetails, packageId } = req.body;
    const userId = req.userId;

    // Validate input
    if (!method || !amount || !paymentDetails) {
      return res.status(400).json({
        error: 'Missing required payment information',
      });
    }

    if (amount < 1 || amount > 100000) {
      return res.status(400).json({
        error: 'Invalid amount. Please enter between $1 and $100,000',
      });
    }

    // Validate payment details
    const validation = validatePaymentDetails(method, paymentDetails);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Process mock payment
    const paymentResult = await processPayment(method, amount, paymentDetails);

    if (paymentResult.status === 'success') {
      // Calculate credits based on amount
      // Default: $12 = 625 credits (approximately 52 credits per dollar)
      const creditRate = 52;
      const creditsToAdd = Math.floor(amount * creditRate);

      // Add credits to user
      await user.addCredits(creditsToAdd, `Payment: ${paymentResult.methodName} ($${amount})`);

      // Create transaction record
      await Transaction.create({
        userId,
        type: 'purchase',
        amount: creditsToAdd,
        balanceBefore: user.credits - creditsToAdd,
        balanceAfter: user.credits,
        description: `Credit purchase: $${amount} via ${paymentResult.methodName}`,
        paymentMethod: method,
        paymentId: paymentResult.transactionId,
        paymentStatus: 'completed',
        amountPaid: amount,
        currency: 'USD',
      });

      res.json({
        status: 'success',
        message: `Successfully added ${creditsToAdd} credits!`,
        transactionId: paymentResult.transactionId,
        creditsAdded: creditsToAdd,
        newBalance: user.credits,
        methodUsed: paymentResult.methodName,
      });
    } else {
      // Payment failed - still create transaction record for audit
      await Transaction.create({
        userId,
        type: 'failed_purchase',
        amount: 0,
        balanceBefore: user.credits,
        balanceAfter: user.credits,
        description: `Failed payment attempt: $${amount} via ${paymentResult.methodName} - ${paymentResult.error}`,
        paymentMethod: method,
        paymentId: paymentResult.transactionId,
        paymentStatus: 'failed',
        amountPaid: amount,
        currency: 'USD',
      });

      res.status(400).json({
        status: 'failed',
        error: paymentResult.error,
        transactionId: paymentResult.transactionId,
        message: `Payment failed: ${paymentResult.error}. Please try again or use a different payment method.`,
      });
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({
      error: 'Payment processing failed. Please try again.',
      details: error.message,
    });
  }
});

/**
 * Get payment history for user
 * GET /api/payment/history
 */
router.get('/history', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    const transactions = await Transaction.find({
      userId,
      type: { $in: ['purchase', 'failed_purchase'] },
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      count: transactions.length,
      payments: transactions,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

/**
 * Validate payment details (before charging)
 * POST /api/payment/validate
 */
router.post('/validate', verifyToken, (req, res) => {
  try {
    const { method, paymentDetails } = req.body;

    if (!method || !paymentDetails) {
      return res.status(400).json({
        error: 'Missing payment method or details',
      });
    }

    const validation = validatePaymentDetails(method, paymentDetails);

    if (validation.valid) {
      res.json({
        valid: true,
        message: 'Payment details are valid',
      });
    } else {
      res.status(400).json({
        valid: false,
        error: validation.error,
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Validation failed' });
  }
});

/**
 * Create Stripe Checkout Session
 * POST /api/payment/create-checkout-session
 */
router.post('/create-checkout-session', verifyToken, async (req, res) => {
  try {
    const { packageId, credits, amount } = req.body;
    const userId = req.userId;

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate amount if not provided (based on credit pricing)
    // Pricing: $12 for 625 credits = $0.0192 per credit
    let finalAmount = amount;
    if (!finalAmount || isNaN(finalAmount)) {
      finalAmount = Math.round((credits / 625) * 12 * 100) / 100; // Round to 2 decimals
    }

    // Validate amount
    if (!finalAmount || finalAmount <= 0 || isNaN(finalAmount)) {
      return res.status(400).json({ 
        error: 'Invalid amount', 
        debug: { credits, amount, finalAmount } 
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${credits} Credits`,
              description: `Purchase ${credits} credits for Shreevid.ai video generation`,
            },
            unit_amount: Math.round(finalAmount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/#/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/#/dashboard?payment=cancelled`,
      client_reference_id: userId.toString(),
      metadata: {
        userId: userId.toString(),
        credits: credits.toString(),
        packageId: packageId || 'custom',
      },
    });

    res.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({
      error: 'Failed to create checkout session',
      details: error.message,
    });
  }
});

/**
 * Stripe Webhook - Handle successful payments
 * POST /api/payment/webhook
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify webhook signature (you'll need to set STRIPE_WEBHOOK_SECRET)
    event = req.body;

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      // Get user and credit info from metadata
      const userId = session.metadata.userId;
      const credits = parseInt(session.metadata.credits);
      const amount = session.amount_total / 100; // Convert from cents

      // Get user
      const user = await User.findById(userId);
      if (user) {
        // Add credits
        await user.addCredits(credits, `Stripe payment: $${amount}`);

        // Create transaction record
        await Transaction.create({
          userId,
          type: 'purchase',
          amount: credits,
          balanceBefore: user.credits - credits,
          balanceAfter: user.credits,
          description: `Credit purchase: $${amount} via Stripe`,
          paymentMethod: 'stripe',
          paymentId: session.id,
          paymentStatus: 'completed',
          amountPaid: amount,
          currency: 'usd',
        });

        console.log(`✓ Added ${credits} credits to user ${userId}`);
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

/**
 * Verify payment session (called from frontend after redirect)
 * GET /api/payment/verify-session/:sessionId
 */
router.get('/verify-session/:sessionId', verifyToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.userId;

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid' && session.metadata.userId === userId.toString()) {
      // Check if we already processed this
      const existingTransaction = await Transaction.findOne({
        paymentId: sessionId,
        userId,
      });

      if (existingTransaction) {
        return res.json({
          status: 'already_processed',
          credits: existingTransaction.amount,
          message: 'Payment already processed',
        });
      }

      // Process the payment if not already done (backup to webhook)
      const credits = parseInt(session.metadata.credits);
      const amount = session.amount_total / 100;

      const user = await User.findById(userId);
      await user.addCredits(credits, `Stripe payment: $${amount}`);

      await Transaction.create({
        userId,
        type: 'purchase',
        amount: credits,
        balanceBefore: user.credits - credits,
        balanceAfter: user.credits,
        description: `Credit purchase: $${amount} via Stripe`,
        paymentMethod: 'stripe',
        paymentId: sessionId,
        paymentStatus: 'completed',
        amountPaid: amount,
        currency: 'usd',
      });

      res.json({
        status: 'success',
        credits,
        newBalance: user.credits,
        message: `Successfully added ${credits} credits!`,
      });
    } else {
      res.status(400).json({
        status: 'failed',
        error: 'Payment not completed or invalid session',
      });
    }
  } catch (error) {
    console.error('Session verification error:', error);
    res.status(500).json({
      error: 'Failed to verify payment session',
      details: error.message,
    });
  }
});

module.exports = router;
