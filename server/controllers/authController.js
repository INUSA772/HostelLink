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

const sendOTPEmail = async (toEmail, otp, firstName) => {
  await transporter.sendMail({
    from: `"PezaHostel" <${process.env.SMTP_FROM}>`,
    to: toEmail,
    subject: 'PezaHostel — Your Verification Code',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#f4f6fa;padding:32px 16px;">
        <div style="background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 4px 24px rgba(13,27,62,0.10);">
          <div style="background:linear-gradient(135deg,#0d1b3e 0%,#112255 100%);padding:32px;text-align:center;">
            <span style="color:#fff;font-size:1.1rem;font-weight:800;">🏠 PezaHostel</span>
            <h1 style="color:#fff;font-size:1.1rem;font-weight:700;margin:12px 0 0;">Email Verification Code</h1>
          </div>
          <div style="padding:32px;text-align:center;">
            <p style="color:#111827;font-size:0.95rem;margin-bottom:8px;">Hi <strong>${firstName}</strong>,</p>
            <p style="color:#4b5563;font-size:0.9rem;line-height:1.6;margin-bottom:24px;">Your verification code is:</p>
            <div style="background:#fff5f2;border:2px solid #e8501a;border-radius:12px;padding:20px;margin-bottom:24px;display:inline-block;">
              <span style="font-size:2.5rem;font-weight:900;color:#e8501a;letter-spacing:8px;">${otp}</span>
            </div>
            <p style="color:#6b7280;font-size:0.82rem;">This code expires in <strong>10 minutes</strong>.</p>
            <p style="color:#6b7280;font-size:0.82rem;">Do not share this code with anyone.</p>
          </div>
          <div style="background:#f4f6fa;padding:16px 32px;text-align:center;">
            <p style="color:#9ca3af;font-size:0.72rem;margin:0;">
              © ${new Date().getFullYear()} PezaHostel · Off-Campus Accommodation · Blantyre, Malawi
            </p>
          </div>
        </div>
      </div>
    `,
  });
};

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

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

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

      if (!user.isActive && user.role === 'owner') {
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
          studentId: user.studentId,
          profilePicture: user.profilePicture,
          verified: user.verified,
          verificationStatus: user.verificationStatus,
        },
      });
    }

    // New user
    const userRole = role || 'student';
    user = await User.create({
      firstName: given_name || 'User',
      lastName: family_name || '',
      email,
      googleId,
      profilePicture: picture,
      role: userRole,
      phoneVerified: false,
      isActive: true,
      verified: true,
      verificationStatus: 'verified',
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
    const { firstName, lastName, email, phone, password, role, studentId } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    if (role === 'student') {
      const user = await User.create({
        firstName, lastName, email, phone, password,
        role, studentId, phoneVerified: true, isActive: true,
      });
      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        token: generateToken(user._id),
        user: {
          _id: user._id, firstName: user.firstName, lastName: user.lastName,
          email: user.email, phone: user.phone, role: user.role,
          studentId: user.studentId, verified: user.verified,
        },
      });
    }

    // Owner — send email OTP
    const otp = generateOTP();
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    let pendingUser = await User.findOne({ email });
    if (!pendingUser) {
      pendingUser = await User.create({
        firstName, lastName, email, phone, password,
        role, phoneVerified: false,
        verificationStatus: 'pending',
        otpCode: hashedOtp,
        otpExpire: Date.now() + 10 * 60 * 1000,
        otpAttempts: 0,
        isActive: false,
      });
    } else {
      pendingUser.otpCode = hashedOtp;
      pendingUser.otpExpire = Date.now() + 10 * 60 * 1000;
      pendingUser.otpAttempts = 0;
      await pendingUser.save({ validateBeforeSave: false });
    }

    await sendOTPEmail(email, otp, firstName);

    return res.status(200).json({
      success: true,
      requiresOtp: true,
      message: `Verification code sent to ${email}`,
      userId: pendingUser._id,
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// ── POST /api/auth/verify-otp ──────────────────────────
exports.verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ success: false, message: 'User ID and OTP are required' });
    }

    const user = await User.findById(userId).select('+otpCode +otpAttempts +otpBlockedUntil +otpExpire');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.otpBlockedUntil && user.otpBlockedUntil > Date.now()) {
      const minutesLeft = Math.ceil((user.otpBlockedUntil - Date.now()) / 60000);
      return res.status(429).json({
        success: false,
        message: `Too many wrong attempts. Try again in ${minutesLeft} minutes.`,
      });
    }

    if (!user.otpExpire || user.otpExpire < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    if (hashedOtp !== user.otpCode) {
      user.otpAttempts += 1;
      if (user.otpAttempts >= 3) {
        user.otpBlockedUntil = Date.now() + 30 * 60 * 1000;
        await user.save({ validateBeforeSave: false });
        return res.status(429).json({
          success: false,
          message: 'Too many wrong attempts. Account blocked for 30 minutes.',
        });
      }
      await user.save({ validateBeforeSave: false });
      return res.status(400).json({
        success: false,
        message: `Wrong OTP. ${3 - user.otpAttempts} attempts remaining.`,
      });
    }

    user.phoneVerified = true;
    user.isActive = true;
    user.verificationStatus = 'verified';
    user.verified = true;
    user.otpCode = undefined;
    user.otpExpire = undefined;
    user.otpAttempts = 0;
    user.otpBlockedUntil = undefined;
    await user.save({ validateBeforeSave: false });

    return res.json({
      success: true,
      message: 'Email verified successfully! Registration complete.',
      token: generateToken(user._id),
      user: {
        _id: user._id, firstName: user.firstName, lastName: user.lastName,
        email: user.email, phone: user.phone, role: user.role,
        verified: user.verified, verificationStatus: user.verificationStatus,
      },
    });

  } catch (error) {
    console.error('verifyOtp error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// ── POST /api/auth/resend-otp ──────────────────────────
exports.resendOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId).select('+otpBlockedUntil');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.otpBlockedUntil && user.otpBlockedUntil > Date.now()) {
      const minutesLeft = Math.ceil((user.otpBlockedUntil - Date.now()) / 60000);
      return res.status(429).json({
        success: false,
        message: `Account blocked. Try again in ${minutesLeft} minutes.`,
      });
    }

    const otp = generateOTP();
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    user.otpCode = hashedOtp;
    user.otpExpire = Date.now() + 10 * 60 * 1000;
    user.otpAttempts = 0;
    await user.save({ validateBeforeSave: false });

    await sendOTPEmail(user.email, otp, user.firstName);

    return res.json({ success: true, message: `New verification code sent to ${user.email}` });

  } catch (error) {
    console.error('resendOtp error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// ── POST /api/auth/login ───────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isActive && user.role === 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Please complete email verification to activate your account.',
        requiresOtp: true,
        userId: user._id,
      });
    }

    if (user.googleId && !user.password) {
      return res.status(400).json({
        success: false,
        message: 'This account uses Google Sign-In. Please use the Google button to login.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: 'Login successful',
      token: generateToken(user._id),
      user: {
        _id: user._id, firstName: user.firstName, lastName: user.lastName,
        email: user.email, phone: user.phone, role: user.role,
        studentId: user.studentId, profilePicture: user.profilePicture,
        verified: user.verified, verificationStatus: user.verificationStatus,
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
        _id: user._id, firstName: user.firstName, lastName: user.lastName,
        email: user.email, phone: user.phone, role: user.role,
        studentId: user.studentId, profilePicture: user.profilePicture,
        verified: user.verified, verificationStatus: user.verificationStatus,
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