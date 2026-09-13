const mongoose = require('mongoose');

// Pay-to-reveal access to a listing's phone/WhatsApp number. Deliberately
// separate from Transaction (room-booking payments) — this must work for
// anonymous visitors, since browsing never requires an account.
const contactAccessSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
      required: true,
    },
    payerPhone: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['initiated', 'processing', 'completed', 'failed', 'cancelled'],
      default: 'initiated',
    },
    paychanguReference: String,
    paychanguStatus: String,
    completedAt: Date,
  },
  { timestamps: true }
);

contactAccessSchema.index({ transactionId: 1 });
contactAccessSchema.index({ hostel: 1 });

module.exports = mongoose.model('ContactAccess', contactAccessSchema);
