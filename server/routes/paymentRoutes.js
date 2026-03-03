const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  initiatePayment,
  handleWebhook,
  verifyPayment,
  getPaymentHistory,
  getTransaction,
} = require('../controllers/paymentController');

// Webhook - no auth (called by Paychangu)
router.post('/webhook', handleWebhook);

// Protected routes
router.post('/initiate', protect, initiatePayment);
router.get('/history', protect, getPaymentHistory);
router.get('/verify/:transactionId', protect, verifyPayment);
router.get('/:id', protect, getTransaction);

module.exports = router;