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

// POST /api/bookings — Create booking (Student only)
router.post('/', protect, authorize('student'), createBooking);

// GET /api/bookings/my-bookings — Student bookings
router.get('/my-bookings', protect, authorize('student'), getMyBookings);

// GET /api/bookings/landlord-bookings — Landlord bookings
router.get('/landlord-bookings', protect, authorize('owner'), getLandlordBookings);

// GET /api/bookings — Students get their own, admins get all
router.get('/', protect, (req, res, next) => {
  if (req.user.role === 'admin') return getAllBookings(req, res, next);
  return getMyBookings(req, res, next);
});

// GET /api/bookings/:id
router.get('/:id', protect, getBooking);

// PUT /api/bookings/:id/confirm
router.put('/:id/confirm', protect, confirmBooking);

// PUT /api/bookings/:id/cancel
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;