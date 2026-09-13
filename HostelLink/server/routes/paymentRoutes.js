const express = require('express');
const router  = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  initiatePayment,
  handleWebhook,
  verifyPayment,
  getPaymentHistory,
  getTransaction,
} = require('../controllers/paymentController');

// ── PUBLIC — Paychangu calls this after payment (NO AUTH) ──
router.post('/webhook', handleWebhook);

// ── PROTECTED ──────────────────────────────────────────────

// ✅ FIXED: authorize('student') not authorize(['student'])
router.post('/initiate', protect, authorize('student'), initiatePayment);

router.get('/history',             protect, getPaymentHistory);
router.get('/verify/:transactionId', protect, verifyPayment);
router.get('/:id',                 protect, getTransaction);

module.exports = router;