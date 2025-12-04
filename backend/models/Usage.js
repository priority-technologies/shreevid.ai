const mongoose = require('mongoose');

const usageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    totalCreditsUsed: { type: Number, default: 0 },
    creditsRemaining: { type: Number, default: 1000 }, // starting credits
    monthlyUsage: { type: Number, default: 0 },
    dailyUsage: { type: Number, default: 0 },
    lastResetDate: { type: Date, default: Date.now },
    videoGenerationCount: { type: Number, default: 0 },
    voiceEditingCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Usage', usageSchema);
