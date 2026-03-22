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
      trim: true,
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
      minlength: [6, 'Password must be at least 6 characters'],
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
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: {
      type: Date
    },
    // Escrow wallet for payment system
    walletBalance: {
      type: Number,
      default: 0
    },
    walletTransactions: [
      {
        type: {
          type: String,
          enum: ['hold', 'release', 'refund', 'withdrawal']
        },
        amount: Number,
        bookingId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Booking'
        },
        description: String,
        status: {
          type: String,
          enum: ['pending', 'completed', 'failed'],
          default: 'pending'
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);