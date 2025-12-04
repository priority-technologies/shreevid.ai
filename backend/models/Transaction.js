const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { 
      type: String, 
      enum: ['purchase', 'deduction', 'bonus', 'refund', 'failed_purchase'], 
      required: true 
    },
    amount: { type: Number, required: true },
    balanceBefore: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    description: { type: String, required: true },
    
    // For purchases
    paymentMethod: { type: String, enum: ['stripe', 'razorpay', 'paypal', 'manual', 'credit_card', 'debit_card', 'upi', 'net_banking'], default: null },
    paymentId: { type: String },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
    amountPaid: { type: Number }, // In currency (USD/INR)
    currency: { type: String, default: 'USD' },
    
    // For deductions
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Index for faster queries
transactionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
