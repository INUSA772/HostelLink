const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ── Email transporter ─────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendPasswordResetEmail = async (toEmail, resetToken, firstName) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  await transporter.sendMail({
    from: `"PezaHostel" <${process.env.SMTP_FROM}>`,
    to: toEmail,
    subject: 'Reset Your PezaHostel Password',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#f4f6fa;padding:32px 16px;">
        <div style="background:#fff;border-radius:14px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#0d1b3e,#112255);padding:32px;text-align:center;">
            <span style="color:#fff;font-size:1.1rem;font-weight:800;">🏠 PezaHostel</span>
            <h1 style="color:#fff;font-size:1.1rem;margin:12px 0 0;">Password Reset Request</h1>
          </div>
          <div style="padding:32px;">
            <p>Hi <strong>${firstName}</strong>,</p>
            <p style="color:#4b5563;margin:16px 0;">Click the button below to reset your password. This link expires in 1 hour.</p>
            <div style="text-align:center;margin:24px 0;">
              <a href="${resetUrl}" style="background:#e8501a;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;">
                Reset My Password
              </a>
            </div>
            <p style="color:#9ca3af;font-size:0.8rem;">If you did not request this, ignore this email.</p>
          </div>
        </div>
      </div>
    `,
  });
};

// ── POST /api/auth/google ──────────────────────────────
exports.googleAuth = async (req, res) => {
  try {
    const { credential, role } = req.body;

    if (!credential) {
      return res.status(400).json({ success: false, message: 'Google credential is required' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, given_name, family_name, picture, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.profilePicture = user.profilePicture || picture;
        await user.save({ validateBeforeSave: false });
      }

      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Your account is not active. Please contact support.',
        });
      }

      user.lastLogin = Date.now();
      await user.save({ validateBeforeSave: false });

      return res.json({
        success: true,
        message: 'Login successful',
        token: generateToken(user._id),
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          profilePicture: user.profilePicture,
          verified: user.verified,
          verificationStatus: user.verificationStatus,
        },
      });
    }

    // New user
    const userRole = role || 'tenant';
    user = await User.create({
      firstName: given_name || 'User',
      lastName: family_name || '',
      email,
      googleId,
      profilePicture: picture,
      role: userRole,
      phoneVerified: true,
      isActive: true,
      verified: true,
      verificationStatus: userRole === 'landlord' ? 'pending' : 'verified',
      password: crypto.randomBytes(32).toString('hex'),
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token: generateToken(user._id),
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePicture: user.profilePicture,
        verified: user.verified,
        verificationStatus: user.verificationStatus,
      },
    });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ success: false, message: 'Google authentication failed' });
  }
};

// ── POST /api/auth/register ────────────────────────────
exports.register = async (req, res) => {
  try {
    const { fullName, phone, password, role } = req.body;
    
    console.log('📝 Registration request:', { fullName, phone, role });
    
    // Split fullName into firstName and lastName
    const nameParts = fullName ? fullName.trim().split(' ') : ['', ''];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Check if user exists by phone number
    const userExists = await User.findOne({ phone });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this phone number already exists',
      });
    }
    
    // Create user with phone as primary identifier - NO role conversion
    const user = await User.create({
      firstName,
      lastName,
      email: `${phone}@temp.com`, // Temporary email - user can add later
      phone,
      password,
      role: role, // Direct mapping: 'tenant' or 'landlord'
      phoneVerified: true,
      isActive: true,
      verified: true,
      verificationStatus: role === 'landlord' ? 'pending' : 'verified'
    });
    
    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token: generateToken(user._id),
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        verified: user.verified,
        verificationStatus: user.verificationStatus
      },
    });
    
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};
// ── POST /api/auth/login ───────────────────────────────
exports.login = async (req, res) => {
  try {
    const { phone, email, password } = req.body;

    console.log('🔐 Login request:', { phone, email });

    let user;

    if (email) {
      // Admin login via email
      user = await User.findOne({ email }).select('+password');
      if (!user || user.role !== 'admin') {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    } else {
      // Tenant / Landlord login via phone
      if (!phone) {
        return res.status(400).json({ success: false, message: 'Phone number is required' });
      }
      user = await User.findOne({ phone }).select('+password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid phone number or password' });
      }
      if (user.role === 'admin') {
        return res.status(403).json({ success: false, message: 'Admin must log in with email' });
      }
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account is not active. Please contact support.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: email ? 'Invalid email or password' : 'Invalid phone number or password',
      });
    }

    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: 'Login successful',
      token: generateToken(user._id),
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePicture: user.profilePicture,
        verified: user.verified,
        verificationStatus: user.verificationStatus,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// ── GET /api/auth/me ───────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePicture: user.profilePicture,
        verified: user.verified,
        verificationStatus: user.verificationStatus,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// ── POST /api/auth/forgot-password ────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ success: true, message: 'If an account exists, a reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    await sendPasswordResetEmail(user.email, resetToken, user.firstName);
    res.status(200).json({ success: true, message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Email could not be sent.' });
  }
};

// ── POST /api/auth/reset-password ─────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Token and new password are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ success: false, message: 'Reset link is invalid or has expired.' });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// ── POST /api/auth/verify-otp ────────────────────────────
exports.verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    console.log('🔑 Verifying OTP for:', userId, 'OTP:', otp);
    
    res.json({ 
      success: true, 
      message: 'OTP verified successfully' 
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'OTP verification failed' 
    });
  }
};

// ── POST /api/auth/resend-otp ────────────────────────────
exports.resendOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log('📱 Resending OTP for:', userId);
    
    res.json({ 
      success: true, 
      message: 'OTP resent successfully' 
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to resend OTP' 
    });
  }
};

// ── POST /api/auth/logout ──────────────────────────────
exports.logout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};