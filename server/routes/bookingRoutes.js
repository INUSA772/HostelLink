const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  createBooking,
  getMyBookings,
  getLandlordBookings,
  getBooking,
  confirmBooking,
  cancelBooking,
  getAllBookings,
} = require('../controllers/bookingController');

// Student routes
router.post('/', protect, authorize('student'), createBooking);
router.get('/my-bookings', protect, authorize('student'), getMyBookings);

// Landlord routes
router.get('/landlord-bookings', protect, authorize('landlord', 'admin'), getLandlordBookings);

// Admin route
router.get('/', protect, authorize('admin'), getAllBookings);

// Shared routes (student, landlord, admin)
router.get('/:id', protect, getBooking);
router.put('/:id/confirm', protect, confirmBooking);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;