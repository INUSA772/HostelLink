const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const paymentController = require('../controllers/paymentController');

// ============================================
// PAYMENT ROUTES
// ============================================

/**
 * @desc    Initiate payment for a booking
 * @route   POST /api/payments/initiate
 * @access  Private (Students only)
 */
router.post(
  '/initiate',
  protect,
  authorize('student'),
  paymentController.initiatePayment
);

/**
 * @desc    Paychange webhook callback
 * @route   POST /api/payments/paychange-callback
 * @access  Public (Paychange only)
 * @note    This endpoint doesn't require authentication
 */
router.post(
  '/paychange-callback',
  paymentController.handlePaychangeCallback
);

/**
 * @desc    Verify payment status
 * @route   GET /api/payments/verify/:transactionId
 * @access  Private (Students only)
 */
router.get(
  '/verify/:transactionId',
  protect,
  authorize('student'),
  paymentController.verifyPayment
);

/**
 * @desc    Get user transactions
 * @route   GET /api/payments/transactions
 * @access  Private (Students only)
 */
router.get(
  '/transactions',
  protect,
  authorize('student'),
  paymentController.getUserTransactions
);

module.exports = router;