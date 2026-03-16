const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please add first name'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Please add last name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please add email'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please add a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Please add phone number'],
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Please add password'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false
    },
    role: {
      type: String,
      enum: ['student', 'owner', 'admin'],
      default: 'student'
    },
    studentId: {
      type: String,
      required: function () {
        return this.role === 'student';
      }
    },
    profilePicture: {
      type: String,
      default: ''
    },
    verified: {
      type: Boolean,
      default: false
    },
    verificationStatus: {
      type: String,
      enum: ['unverified', 'pending', 'verified', 'rejected'],
      default: 'unverified'
    },
    verificationDocuments: [{ type: String }],
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: { type: Date },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    emailVerificationToken: String,
    emailVerificationExpire: Date,

    // ── OTP fields ─────────────────────────────────────────
    otpCode: { type: String, select: false },
    otpExpire: { type: Date },
    otpAttempts: { type: Number, default: 0 },
    otpBlockedUntil: { type: Date },
    phoneVerified: { type: Boolean, default: false },

    // ── Escrow wallet ──────────────────────────────────────
    walletBalance: { type: Number, default: 0 },
    walletTransactions: [
      {
        type: { type: String, enum: ['hold', 'release', 'refund', 'withdrawal'] },
        amount: Number,
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
        description: String,
        status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);