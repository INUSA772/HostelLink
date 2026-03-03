const Review = require('../models/Review');
const Hostel = require('../models/Hostel');
const Booking = require('../models/Booking');

// @desc  Get reviews for a hostel
// @route GET /api/reviews/hostel/:hostelId
exports.getHostelReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ hostel: req.params.hostelId, isVisible: true })
      .populate('student', 'firstName lastName profilePicture')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching reviews' });
  }
};

// @desc  Create review
// @route POST /api/reviews
exports.createReview = async (req, res) => {
  try {
    const { hostelId, rating, comment, categories } = req.body;

    const hostel = await Hostel.findById(hostelId);
    if (!hostel) return res.status(404).json({ success: false, message: 'Hostel not found' });

    // Check if student has a completed booking at this hostel
    const booking = await Booking.findOne({
      student: req.user._id,
      hostel: hostelId,
      status: { $in: ['confirmed', 'completed', 'active'] },
    });
    if (!booking) {
      return res.status(400).json({
        success: false,
        message: 'You can only review hostels you have stayed at',
      });
    }

    // Prevent duplicate reviews
    const existing = await Review.findOne({ student: req.user._id, hostel: hostelId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this hostel' });
    }

    const review = await Review.create({
      student: req.user._id,
      hostel: hostelId,
      rating,
      comment,
      categories,
    });

    // Update hostel average rating
    const allReviews = await Review.find({ hostel: hostelId, isVisible: true });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Hostel.findByIdAndUpdate(hostelId, {
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length,
    });

    await review.populate('student', 'firstName lastName profilePicture');
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error creating review' });
  }
};

// @desc  Update review
// @route PUT /api/reviews/:id
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    if (review.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this review' });
    }

    const { rating, comment, categories } = req.body;
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    if (categories) review.categories = categories;
    await review.save();

    // Recalculate hostel rating
    const allReviews = await Review.find({ hostel: review.hostel, isVisible: true });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Hostel.findByIdAndUpdate(review.hostel, {
      averageRating: Math.round(avgRating * 10) / 10,
    });

    res.json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating review' });
  }
};

// @desc  Delete review
// @route DELETE /api/reviews/:id
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    const isOwner = review.student.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();

    // Recalculate hostel rating
    const allReviews = await Review.find({ hostel: review.hostel, isVisible: true });
    const avgRating = allReviews.length > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : 0;
    await Hostel.findByIdAndUpdate(review.hostel, {
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length,
    });

    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting review' });
  }
};

// @desc  Owner reply to review
// @route POST /api/reviews/:id/reply
exports.replyToReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate('hostel', 'owner');
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    if (review.hostel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the hostel owner can reply' });
    }

    review.ownerReply = { text: req.body.text, repliedAt: new Date() };
    await review.save();

    res.json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error adding reply' });
  }
};