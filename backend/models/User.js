const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String }, // optional for OAuth users
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    profilePic: { type: String },
    authProvider: { type: String, enum: ['email', 'google'], default: 'email' },
    googleId: { type: String },
    isVerified: { type: Boolean, default: false },
    otpCode: { type: String },
    otpExpiry: { type: Date },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
    
    // Admin Access
    isAdmin: { type: Boolean, default: false },
    
    // Prepaid Credit System
    credits: { type: Number, default: 125 }, // Free credits on signup
    totalCreditsEarned: { type: Number, default: 125 }, // Lifetime credits earned
    totalCreditsSpent: { type: Number, default: 0 }, // Lifetime credits spent
    
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Credit management methods
userSchema.methods.hasEnoughCredits = function(amount) {
  return this.credits >= amount;
};

userSchema.methods.deductCredits = async function(amount, reason = 'Video generation') {
  if (!this.hasEnoughCredits(amount)) {
    throw new Error('Insufficient credits');
  }
  this.credits -= amount;
  this.totalCreditsSpent += amount;
  await this.save();
  return this.credits;
};

userSchema.methods.addCredits = async function(amount, reason = 'Purchase') {
  this.credits += amount;
  this.totalCreditsEarned += amount;
  await this.save();
  return this.credits;
};

module.exports = mongoose.model('User', userSchema);
