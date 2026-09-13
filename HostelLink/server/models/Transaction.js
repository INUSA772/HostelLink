const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
      required: true
    },
    roomRent: {
      type: Number,
      required: true,
      min: 0
    },
    platformFee: {
      type: Number,
      default: 2000
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    paymentMethod: {
      type: String,
      enum: ['mobile_money', 'bank_transfer', 'card'],
      required: true
    },
    status: {
      type: String,
      enum: ['initiated', 'processing', 'pending', 'completed', 'failed', 'cancelled'],
      default: 'initiated'
    },
    paychanguReference: String,
    paychanguStatus: String,
    paychanguTransactionId: String,
    paymentDetails: {
      initiatedAt: Date,
      completedAt: Date,
      paymentMethod: String,
      phoneNumber: String,
      lastFourDigits: String,
      bankName: String
    },
    errorMessage: String,
    errorCode: String,
    ipAddress: String,
    userAgent: String,
    verified: {
      type: Boolean,
      default: false
    },
    verificationToken: String,
    verificationExpire: Date,
    refund: {
      status: {
        type: String,
        enum: ['none', 'pending', 'processed', 'failed'],
        default: 'none'
      },
      amount: { type: Number, default: 0 },
      reason: String,
      processedAt: Date,
      refundReference: String
    },
    description: String,
    metadata: {
      clientIp: String,
      userAgent: String,
      platform: String,
      appVersion: String
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual
transactionSchema.virtual('netAmount').get(function () {
  return this.roomRent;
});

// Fix: removed next() — modern Mongoose handles async automatically
transactionSchema.pre('save', function () {
  if (this.platformFee !== 2000) {
    this.platformFee = 2000;
  }
  if (!this.totalAmount || this.totalAmount === 0) {
    this.totalAmount = this.roomRent + this.platformFee;
  }
});

transactionSchema.index({ transactionId: 1 });
transactionSchema.index({ booking: 1 });
transactionSchema.index({ student: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);