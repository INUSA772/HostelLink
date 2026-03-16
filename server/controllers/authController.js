const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const AfricasTalking = require('africastalking');

// ── Africa's Talking SMS ──────────────────────────────────────────────────────
const AT = AfricasTalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
});
const sms = AT.SMS;

// ── Email transporter ─────────────────────────────────────────────────────────
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
    from: `"HostelLink" <${process.env.SMTP_FROM}>`,
    to: toEmail,
    subject: 'Reset Your HostelLink Password',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#f4f6fa;padding:32px 16px;">
        <div style="background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 4px 24px rgba(13,27,62,0.10);">
          <div style="background:linear-gradient(135deg,#0d1b3e 0%,#112255 100%);padding:32px;text-align:center;">
            <div style="display:inline-block;background:#e8501a;border-radius:10px;padding:10px 20px;margin-bottom:12px;">
              <span style="color:#fff;font-size:1.1rem;font-weight:800;">🏠 HostelLink</span>
            </div>
            <h1 style="color:#fff;font-size:1.2rem;font-weight:700;margin:0;">Password Reset Request</h1>
          </div>
          <div style="padding:32px;">
            <p style="color:#111827;font-size:0.95rem;margin-bottom:8px;">Hi <strong>${firstName}</strong>,</p>
            <p style="color:#4b5563;font-size:0.9rem;line-height:1.6;margin-bottom:24px;">
              We received a request to reset your HostelLink password. Click the button below to create a new password.
              This link will expire in <strong>1 hour</strong>.
            </p>
            <div style="text-align:center;margin-bottom:24px;">
              <a href="${resetUrl}" style="display:inline-block;background:#e8501a;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:0.95rem;">
                Reset My Password
              </a>
            </div>
            <p style="color:#6b7280;font-size:0.8rem;margin-bottom:6px;">Or copy this link into your browser:</p>
            <p style="background:#f4f6fa;border-radius:6px;padding:10px 12px;font-size:0.75rem;color:#1a3fa4;word-break:break-all;margin-bottom:24px;">${resetUrl}</p>
            <hr style="border:none;border-top:1px solid #e4e6eb;margin-bottom:20px;" />
            <p style="color:#9ca3af;font-size:0.78rem;line-height:1.5;">
              If you did not request a password reset, you can safely ignore this email.
            </p>
          </div>
          <div style="background:#f4f6fa;padding:16px 32px;text-align:center;">
            <p style="color:#9ca3af;font-size:0.72rem;margin:0;">
              © ${new Date().getFullYear()} HostelLink · Off-Campus Accommodation · Blantyre, Malawi
            </p>
          </div>
        </div>
      </div>
    `,
  });
};

// ── Helper: generate 6-digit OTP ──────────────────────────────────────────────
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ── Helper: format phone for Africa's Talking (must be +265XXXXXXXXX) ─────────
const formatPhone = (phone) => {
  let p = phone.replace(/\s+/g, '').replace(/-/g, '');
  if (p.startsWith('0')) p = '+265' + p.slice(1);
  if (p.startsWith('265')) p = '+' + p;
  if (!p.startsWith('+')) p = '+265' + p;
  return p;
};

// ── Helper: send OTP via SMS ───────────────────────────────────────────────────
const sendOTPSms = async (phone, otp, firstName) => {
  const formattedPhone = formatPhone(phone);
  await sms.send({
    to: [formattedPhone],
    message: `Hi ${firstName}, your PezaHostel verification code is: ${otp}. This code expires in 10 minutes. Do not share it with anyone.`,
    from: process.env.AT_SENDER_ID || 'HOSTELLINK',
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/register
// For students: creates account immediately
// For owners: sends OTP first, account created after verification
// ─────────────────────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, role, studentId } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: userExists.email === email
          ? 'User already exists with this email'
          : 'User already exists with this phone number'
      });
    }

    // Students register immediately — no OTP needed
    if (role === 'student') {
      const user = await User.create({
        firstName, lastName, email, phone, password,
        role, studentId, phoneVerified: true
      });
      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        token: generateToken(user._id),
        user: {
          _id: user._id, firstName: user.firstName, lastName: user.lastName,
          email: user.email, phone: user.phone, role: user.role,
          studentId: user.studentId, verified: user.verified,
          verificationStatus: user.verificationStatus
        }
      });
    }

    // Owners: generate OTP and send SMS
    const otp = generateOTP();
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    // Store temp data + OTP in a pending user record
    let pendingUser = await User.findOne({ email });
    if (!pendingUser) {
      pendingUser = await User.create({
        firstName, lastName, email, phone, password,
        role, phoneVerified: false,
        verificationStatus: 'pending',
        otpCode: hashedOtp,
        otpExpire: Date.now() + 10 * 60 * 1000, // 10 minutes
        otpAttempts: 0,
        isActive: false // account inactive until OTP verified
      });
    } else {
      pendingUser.otpCode = hashedOtp;
      pendingUser.otpExpire = Date.now() + 10 * 60 * 1000;
      pendingUser.otpAttempts = 0;
      await pendingUser.save({ validateBeforeSave: false });
    }

    // Send OTP via SMS
    await sendOTPSms(phone, otp, firstName);

    return res.status(200).json({
      success: true,
      requiresOtp: true,
      message: `Verification code sent to ${phone}. Please enter it to complete registration.`,
      userId: pendingUser._id
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/verify-otp
// Verifies the OTP sent to landlord's phone
// ─────────────────────────────────────────────────────────────────────────────
exports.verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ success: false, message: 'User ID and OTP are required' });
    }

    const user = await User.findById(userId).select('+otpCode +otpAttempts +otpBlockedUntil +otpExpire');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if blocked
    if (user.otpBlockedUntil && user.otpBlockedUntil > Date.now()) {
      const minutesLeft = Math.ceil((user.otpBlockedUntil - Date.now()) / 60000);
      return res.status(429).json({
        success: false,
        message: `Too many wrong attempts. Try again in ${minutesLeft} minutes.`
      });
    }

    // Check if expired
    if (!user.otpExpire || user.otpExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Check OTP
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    if (hashedOtp !== user.otpCode) {
      user.otpAttempts += 1;

      // Block after 3 wrong attempts for 30 minutes
      if (user.otpAttempts >= 3) {
        user.otpBlockedUntil = Date.now() + 30 * 60 * 1000;
        await user.save({ validateBeforeSave: false });
        return res.status(429).json({
          success: false,
          message: 'Too many wrong attempts. Account blocked for 30 minutes.'
        });
      }

      await user.save({ validateBeforeSave: false });
      return res.status(400).json({
        success: false,
        message: `Wrong OTP. ${3 - user.otpAttempts} attempts remaining.`
      });
    }

    // OTP correct — activate account
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
      message: 'Phone verified successfully! Registration complete.',
      token: generateToken(user._id),
      user: {
        _id: user._id, firstName: user.firstName, lastName: user.lastName,
        email: user.email, phone: user.phone, role: user.role,
        verified: user.verified, verificationStatus: user.verificationStatus
      }
    });

  } catch (error) {
    console.error('verifyOtp error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/resend-otp
// Resends OTP to landlord's phone
// ─────────────────────────────────────────────────────────────────────────────
exports.resendOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId).select('+otpBlockedUntil');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.otpBlockedUntil && user.otpBlockedUntil > Date.now()) {
      const minutesLeft = Math.ceil((user.otpBlockedUntil - Date.now()) / 60000);
      return res.status(429).json({
        success: false,
        message: `Account blocked. Try again in ${minutesLeft} minutes.`
      });
    }

    const otp = generateOTP();
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    user.otpCode = hashedOtp;
    user.otpExpire = Date.now() + 10 * 60 * 1000;
    user.otpAttempts = 0;
    await user.save({ validateBeforeSave: false });

    await sendOTPSms(user.phone, otp, user.firstName);

    return res.json({
      success: true,
      message: `New verification code sent to ${user.phone}`
    });

  } catch (error) {
    console.error('resendOtp error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Block inactive owners who haven't verified OTP
    if (!user.isActive && user.role === 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Please complete phone verification to activate your account.',
        requiresOtp: true,
        userId: user._id
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
        studentId: user.studentId, verified: user.verified,
        verificationStatus: user.verificationStatus
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/auth/me
// ─────────────────────────────────────────────────────────────────────────────
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
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/forgot-password
// ─────────────────────────────────────────────────────────────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ success: true, message: 'If an account with that email exists, a reset link has been sent.' });
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
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
      }
    } catch (_) {}
    res.status(500).json({ success: false, message: 'Email could not be sent.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/reset-password
// ─────────────────────────────────────────────────────────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ success: false, message: 'Token and new password are required' });
    if (password.length < 8) return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpire: { $gt: Date.now() } });

    if (!user) return res.status(400).json({ success: false, message: 'Reset link is invalid or has expired.' });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};