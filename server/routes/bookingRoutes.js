// server/routes/bookingRoutes.js
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

/**
 * ═══════════════════════════════════════════════════════════════
 * STUDENT ROUTES
 * ═══════════════════════════════════════════════════════════════
 */

// POST /api/bookings - Create booking (Student only)
router.post(
  '/',
  protect,
  authorize('student'),
  createBooking
);

// GET /api/bookings/my-bookings - Get all bookings for logged-in student
router.get(
  '/my-bookings',
  protect,
  authorize('student'),
  getMyBookings
);

/**
 * ═══════════════════════════════════════════════════════════════
 * LANDLORD ROUTES
 * ═══════════════════════════════════════════════════════════════
 */

// GET /api/bookings/landlord-bookings - Get all bookings for landlord's hostels
router.get(
  '/landlord-bookings',
  protect,
  authorize('owner'),
  getLandlordBookings
);

/**
 * ═══════════════════════════════════════════════════════════════
 * ADMIN ROUTES
 * ═══════════════════════════════════════════════════════════════
 */

// GET /api/bookings - Get all bookings (Admin only)
router.get(
  '/',
  protect,
  authorize('admin'),
  getAllBookings
);

/**
 * ═══════════════════════════════════════════════════════════════
 * SHARED ROUTES (Protected, any authenticated user)
 * ═══════════════════════════════════════════════════════════════
 */

// GET /api/bookings/:id - Get single booking details
router.get(
  '/:id',
  protect,
  getBooking
);

// PUT /api/bookings/:id/confirm - Confirm booking (Student after payment)
router.put(
  '/:id/confirm',
  protect,
  confirmBooking
);

// PUT /api/bookings/:id/cancel - Cancel booking
router.put(
  '/:id/cancel',
  protect,
  cancelBooking
);

module.exports = router;