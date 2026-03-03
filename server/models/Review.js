const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
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
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      maxlength: [1000, 'Review cannot exceed 1000 characters'],
    },
    categories: {
      cleanliness: { type: Number, min: 1, max: 5 },
      security: { type: Number, min: 1, max: 5 },
      location: { type: Number, min: 1, max: 5 },
      valueForMoney: { type: Number, min: 1, max: 5 },
    },
    ownerReply: {
      text: String,
      repliedAt: Date,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    helpful: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// One review per student per hostel
reviewSchema.index({ student: 1, hostel: 1 }, { unique: true });
reviewSchema.index({ hostel: 1, isVisible: 1 });

module.exports = mongoose.model('Review', reviewSchema);