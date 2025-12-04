const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    creditsUsed: { type: Number, required: true },
    serviceType: { type: String, enum: ['video-generation', 'voice-editing', 'premium-feature'], default: 'video-generation' },
    paymentStatus: { type: String, enum: ['pending', 'processing', 'completed', 'success', 'failed'], default: 'pending' },
    paymentMethod: { type: String, enum: ['credit-card', 'debit-card', 'upi', 'net-banking'], default: 'credit-card' },
    transactionId: { type: String, unique: true },
    billingDate: { type: Date, default: Date.now },
    dueDate: { type: Date },
    isPaid: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Billing', billingSchema);
