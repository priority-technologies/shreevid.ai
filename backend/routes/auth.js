const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const Usage = require('../models/Usage');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Email configuration with Gmail SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Helper: Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Helper: Send Email
const sendEmail = async (email, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Shreevid.ai" <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      html,
    });
    console.log(`✓ Email sent to ${email}: ${subject}`);
    return true;
  } catch (error) {
    console.error('Email send failed:', error.message);
    // In production, we should still return false and handle it
    return false;
  }
};

// Admin email list
const ADMIN_EMAILS = [
  'info@prioritytechnologiess.com',
  'priorityassociates8@gmail.com',
  'rupaliatre8@gmail.com',
  'prax420@gmail.com'
];

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

    // Check if email is in admin list
    const isAdminEmail = ADMIN_EMAILS.includes(email.toLowerCase());

    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      otpCode: otp,
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
      authProvider: 'email',
      isAdmin: isAdminEmail, // Auto-grant admin if in list
      role: isAdminEmail ? 'admin' : 'user', // Set role to admin if in admin list
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

// ========================================
// GOOGLE OAUTH CONFIGURATION
// ========================================

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ email: profile.emails[0].value });

      if (user) {
        // User exists - update Google profile info
        user.googleId = profile.id;
        user.authProvider = 'google';
        user.emailVerified = true; // Google emails are pre-verified
        if (profile.photos && profile.photos.length > 0) {
          user.profilePicture = profile.photos[0].value;
        }
        await user.save();
      } else {
        // Create new user
        const isAdminEmail = ADMIN_EMAILS.includes(profile.emails[0].value.toLowerCase());
        
        user = new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          firstName: profile.name.givenName || '',
          lastName: profile.name.familyName || '',
          profilePicture: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : '',
          authProvider: 'google',
          emailVerified: true, // Google emails are pre-verified
          isAdmin: isAdminEmail,
          role: isAdminEmail ? 'admin' : 'user',
          password: await bcrypt.hash(uuidv4(), 10), // Random password for Google users
        });

        await user.save();

        // Create usage record
        await Usage.create({ userId: user._id });
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Routes
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: process.env.FRONTEND_URL + '/#/login?error=google_auth_failed',
    session: false 
  }),
  async (req, res) => {
    try {
      // Generate JWT token
      const token = jwt.sign(
        { userId: req.user._id, email: req.user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '30d' }
      );

      // Redirect to frontend with token
      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendURL}/#/auth/callback?token=${token}`);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/#/login?error=auth_failed`);
    }
  }
);

// Get current user (for OAuth callback)
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
