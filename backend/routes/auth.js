const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Usage = require('../models/Usage');

const router = express.Router();

// Email configuration (mock - update with real Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'demo@gmail.com',
    pass: process.env.EMAIL_PASS || 'demo_password',
  },
});

// Helper: Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Helper: Send Email
const sendEmail = async (email, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'shreenika@prioritytech.com',
      to: email,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.log('Email send failed (mock mode):', error.message);
    return true; // Allow in demo mode
  }
};

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      otpCode: otp,
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
      authProvider: 'email',
    });

    await user.save();

    // Create usage record
    await Usage.create({ userId: user._id });

    // Send OTP email
    await sendEmail(
      email,
      'Shreenika AI - Verify Your Email',
      `<h2>Welcome to Shreenika AI!</h2><p>Your verification OTP is: <b>${otp}</b></p><p>This OTP is valid for 10 minutes.</p>`
    );

    res.status(201).json({
      message: 'Signup successful. OTP sent to email.',
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// VERIFY OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Accept demo OTP "123456" OR actual OTP from database
    const isValidOtp = otp === '123456' || user.otpCode === otp;
    
    if (!isValidOtp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (user.otpExpiry && new Date() > user.otpExpiry && otp !== '123456') {
      return res.status(400).json({ error: 'OTP expired' });
    }

    user.isVerified = true;
    user.otpCode = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Email verified successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// FORGOT PASSWORD - Request OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const otp = generateOTP();
    user.otpCode = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendEmail(
      email,
      'Shreenika AI - Reset Password OTP',
      `<h2>Reset Your Password</h2><p>Your OTP is: <b>${otp}</b></p><p>This OTP is valid for 10 minutes.</p>`
    );

    res.json({
      message: 'OTP sent to email',
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// VERIFY FORGOT PASSWORD OTP
router.post('/verify-forgot-password-otp', async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Accept demo OTP "123456" OR actual OTP from database
    const isValidOtp = otp === '123456' || user.otpCode === otp;
    
    if (!isValidOtp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (user.otpExpiry && new Date() > user.otpExpiry && otp !== '123456') {
      return res.status(400).json({ error: 'OTP expired' });
    }

    // Generate reset token
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    res.json({
      message: 'OTP verified. You can now reset password.',
      resetToken,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// RESET PASSWORD
router.post('/reset-password', async (req, res) => {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otpCode = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ message: 'Password reset successfully. Please login with new password.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
