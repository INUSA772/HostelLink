const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// ─── Email transporter ───────────────────────────────────────────────────────
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
              <a href="${resetUrl}"
                style="display:inline-block;background:#e8501a;color:#fff;text-decoration:none;
                       padding:14px 32px;border-radius:8px;font-weight:700;font-size:0.95rem;">
                Reset My Password
              </a>
            </div>
            <p style="color:#6b7280;font-size:0.8rem;margin-bottom:6px;">Or copy this link into your browser:</p>
            <p style="background:#f4f6fa;border-radius:6px;padding:10px 12px;font-size:0.75rem;
                      color:#1a3fa4;word-break:break-all;margin-bottom:24px;">${resetUrl}</p>
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

// ─── Controllers ─────────────────────────────────────────────────────────────

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, role, studentId } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({ firstName, lastName, email, phone, password, role, studentId });

    if (user) {
      res.status(201).json({
        success: true,
        message: 'Registration successful',
        token: generateToken(user._id),
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          studentId: user.studentId,
          verified: user.verified,
          verificationStatus: user.verificationStatus
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    user.lastLogin = Date.now();
    await user.save();

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
        studentId: user.studentId,
        verified: user.verified,
        verificationStatus: user.verificationStatus
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
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
        studentId: user.studentId,
        profilePicture: user.profilePicture,
        verified: user.verified,
        verificationStatus: user.verificationStatus,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Forgot password — send reset email
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    // Always respond the same way — don't reveal whether email exists
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a reset link has been sent.'
      });
    }

    // Generate raw token → hash it → store hash in DB
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save({ validateBeforeSave: false });

    // Send email with raw (unhashed) token
    await sendPasswordResetEmail(user.email, resetToken, user.firstName);

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);

    // Clean up token if email failed to send
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
      }
    } catch (_) {}

    res.status(500).json({
      success: false,
      message: 'Email could not be sent. Please check your SMTP config and try again.'
    });
  }
};

// @desc    Reset password using token from email link
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Token and new password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    // Hash the incoming token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Reset link is invalid or has expired. Please request a new one.'
      });
    }

    // Set new password — pre-save hook in User model will hash it
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now log in with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};