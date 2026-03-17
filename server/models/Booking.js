const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
      required: true,
    },
    checkIn: {
      type: Date,
      required: [true, 'Check-in date is required'],
    },
    checkOut: {
      type: Date,
    },
    duration: {
      type: Number,
      default: 1,
      min: 1,
    },
    roomType: {
      type: String,
      enum: ['single', 'shared', 'self_contained'],
      default: 'single',
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['payment_pending', 'confirmed', 'active', 'completed', 'cancelled'],
      default: 'payment_pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'failed', 'refunded'],
      default: 'unpaid',
    },
    specialRequests: {
      type: String,
      maxlength: 500,
    },
    cancellationReason: {
      type: String,
    },
    moveInConfirmed: {
      type: Boolean,
      default: false,
    },
    moveInDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Auto-calculate checkout date based on duration in months
bookingSchema.pre('save', function () {
  if (this.checkIn && this.duration) {
    const checkout = new Date(this.checkIn);
    checkout.setMonth(checkout.getMonth() + this.duration);
    this.checkOut = checkout;
  }
});

bookingSchema.index({ student: 1, status: 1 });
bookingSchema.index({ hostel: 1, status: 1 });
bookingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);