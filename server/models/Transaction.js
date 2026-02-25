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
    // Amount breakdown
    roomRent: {
      type: Number,
      required: true,
      min: 0
    },
    platformFee: {
      type: Number,
      default: 2000, // Fixed 2000 MWK booking fee for platform
      immutable: true
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    // Payment method
    paymentMethod: {
      type: String,
      enum: ['mobile_money', 'bank_transfer', 'card'],
      required: true
    },
    // Payment status
    status: {
      type: String,
      enum: ['initiated', 'processing', 'pending', 'completed', 'failed', 'cancelled'],
      default: 'initiated'
    },
    // Paychange details
    paychanguReference: String,
    paychanguStatus: String,
    paychanguTransactionId: String,
    
    // Payment details
    paymentDetails: {
      initiatedAt: Date,
      completedAt: Date,
      paymentMethod: String,
      phoneNumber: String,
      lastFourDigits: String,
      bankName: String
    },
    
    // Error handling
    errorMessage: String,
    errorCode: String,
    
    // Security & Verification
    ipAddress: String,
    userAgent: String,
    verified: {
      type: Boolean,
      default: false
    },
    verificationToken: String,
    verificationExpire: Date,
    
    // Refund tracking
    refund: {
      status: {
        type: String,
        enum: ['none', 'pending', 'processed', 'failed'],
        default: 'none'
      },
      amount: {
        type: Number,
        default: 0
      },
      reason: String,
      processedAt: Date,
      refundReference: String
    },
    
    // Metadata
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

// Virtual - Calculate net amount after platform fee
transactionSchema.virtual('netAmount').get(function() {
  return this.roomRent; // Owner gets room rent only
});

// Index for quick lookups
transactionSchema.index({ transactionId: 1 });
transactionSchema.index({ booking: 1 });
transactionSchema.index({ student: 1 });
transactionSchema.index({ hostel: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ 'paymentDetails.completedAt': -1 });

// Middleware - Validate platform fee is always 2000
transactionSchema.pre('save', function(next) {
  if (this.platformFee !== 2000) {
    this.platformFee = 2000;
  }
  
  // Calculate total if not set
  if (!this.totalAmount || this.totalAmount === 0) {
    this.totalAmount = this.roomRent + this.platformFee;
  }
  
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);