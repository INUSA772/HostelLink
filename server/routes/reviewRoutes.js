const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getHostelReviews,
  createReview,
  updateReview,
  deleteReview,
  replyToReview,
} = require('../controllers/reviewController');

router.get('/hostel/:hostelId', getHostelReviews);
router.post('/', protect, authorize('student'), createReview);
router.put('/:id', protect, authorize('student'), updateReview);
router.delete('/:id', protect, deleteReview);
router.post('/:id/reply', protect, authorize('landlord', 'admin'), replyToReview);

module.exports = router;