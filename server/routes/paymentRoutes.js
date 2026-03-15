// server/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  initiatePayment,
  handleWebhook,
  verifyPayment,
  getPaymentHistory,
  getTransaction,
} = require('../controllers/paymentController');

// ═══════════════════════════════════════════════════════════════
// PUBLIC ROUTES
// ═══════════════════════════════════════════════════════════════

// Webhook - Called by Paychangu after payment (NO AUTH)
// POST /api/payments/webhook
router.post('/webhook', handleWebhook);

// ═══════════════════════════════════════════════════════════════
// PROTECTED ROUTES (AUTH REQUIRED)
// ═══════════════════════════════════════════════════════════════

// Initiate payment - Start payment process
// POST /api/payments/initiate
// Body: { bookingId, paymentMethod, mobileNumber? }
// Response: { paymentUrl, transactionId, amount }
router.post('/initiate', protect, authorize(['student']), initiatePayment);

// Verify payment - Check payment status
// GET /api/payments/verify/:transactionId
router.get('/verify/:transactionId', protect, verifyPayment);

// Get payment history - Get all transactions for user
// GET /api/payments/history
router.get('/history', protect, getPaymentHistory);

// Get single transaction - Get transaction details
// GET /api/payments/:id
router.get('/:id', protect, getTransaction);

module.exports = router;
