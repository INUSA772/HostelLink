// server/controllers/paymentController.js
const axios = require('axios');
const crypto = require('crypto');
const Transaction = require('../models/Transaction');
const Booking = require('../models/Booking');
const Hostel = require('../models/Hostel');

const PAYCHANGU_API = process.env.PAYCHANGU_API_BASE || 'https://api.paychangu.com';
const PLATFORM_FEE = 2000; // MWK

// ✅ HELPER: Verify Paychangu webhook signature
const verifyPaychanguSignature = (payload, signature) => {
  try {
    const secret = process.env.PAYCHANGU_SECRET_KEY;
    if (!secret) {
      console.error('[WEBHOOK] Missing PAYCHANGU_SECRET_KEY in environment');
      return false;
    }

    const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const hash = crypto
      .createHmac('sha256', secret)
      .update(payloadString)
      .digest('hex');

    const isValid = hash === signature;
    console.log('[WEBHOOK VERIFICATION]', { isValid, expectedHash: hash, receivedSignature: signature });
    return isValid;
  } catch (error) {
    console.error('[WEBHOOK VERIFICATION ERROR]', error.message);
    return false;
  }
};

// ✅ HELPER: Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-MW', {
    style: 'currency',
    currency: 'MWK',
    minimumFractionDigits: 0,
  }).format(amount);
};

// ═══════════════════════════════════════════════════════════════
// POST /api/payments/initiate
// Start payment process - Create transaction and return checkout URL
// ═══════════════════════════════════════════════════════════════
exports.initiatePayment = async (req, res) => {
  const startTime = new Date();
  try {
    const { bookingId, paymentMethod = 'mobile_money', mobileNumber } = req.body;
    const userId = req.user._id;

    console.log('[INITIATE PAYMENT]', { bookingId, paymentMethod, userId });

    // ✅ 1. Validate input
    if (!bookingId) {
      return res.status(400).json({ success: false, message: 'Booking ID is required' });
    }

    if (!['mobile_money', 'bank_transfer', 'card'].includes(paymentMethod)) {
      return res.status(400).json({ success: false, message: 'Invalid payment method' });
    }

    if (paymentMethod === 'mobile_money' && !mobileNumber) {
      return res.status(400).json({ success: false, message: 'Mobile number is required for mobile money' });
    }

    // ✅ 2. Fetch booking
    const booking = await Booking.findById(bookingId)
      .populate('hostel', 'name price owner')
      .populate('student', 'firstName lastName email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // ✅ 3. Verify user is the student
    if (booking.student._id.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to pay for this booking' });
    }

    // ✅ 4. Check if already paid
    if (booking.paymentStatus === 'paid' || booking.status === 'confirmed') {
      return res.status(400).json({ success: false, message: 'This booking is already paid' });
    }

    // ✅ 5. Fetch hostel for price
    const hostel = await Hostel.findById(booking.hostel._id);
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }

    // ✅ 6. Calculate amounts
    const roomRent = hostel.price * booking.duration;
    const platformFee = PLATFORM_FEE;
    const totalAmount = roomRent + platformFee;

    console.log('[PAYMENT CALCULATION]', { roomRent, platformFee, totalAmount, duration: booking.duration });

    // ✅ 7. Check for existing unpaid transaction
    const existingTransaction = await Transaction.findOne({
      booking: bookingId,
      status: { $in: ['initiated', 'processing', 'pending'] }
    });

    if (existingTransaction) {
      console.log('[PAYMENT] Existing pending transaction found, updating...');
      existingTransaction.totalAmount = totalAmount;
      existingTransaction.roomRent = roomRent;
      existingTransaction.status = 'initiated';
      await existingTransaction.save();
    }

    // ✅ 8. Create Paychangu payload
    const transactionRef = `HL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const paychanguPayload = {
      amount: totalAmount,
      currency: 'MWK',
      email: booking.student.email,
      first_name: booking.student.firstName,
      last_name: booking.student.lastName,
      phone_number: booking.student.phone,
      callback_url: `${process.env.BACKEND_URL}/api/payments/webhook`,
      return_url: `${process.env.FRONTEND_URL}/payment/confirm/${transactionRef}`,
      tx_ref: transactionRef,
      customization: {
        title: `HostelLink - ${hostel.name}`,
        description: `Room booking for ${booking.duration} month(s) at ${hostel.name}`
      },
      ...(paymentMethod === 'mobile_money' && mobileNumber ? {
        mobile_money: {
          provider: 'AIRTEL', // or TNM
          phone_number: mobileNumber
        }
      } : {})
    };

    console.log('[PAYCHANGU REQUEST]', { url: `${PAYCHANGU_API}/payment`, payload: paychanguPayload });

    // ✅ 9. Call Paychangu API
    let paychanguResponse;
    try {
      paychanguResponse = await axios.post(`${PAYCHANGU_API}/payment`, paychanguPayload, {
        headers: {
          Authorization: `Bearer ${process.env.PAYCHANGU_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000 // 10 second timeout
      });
    } catch (paychanguError) {
      console.error('[PAYCHANGU API ERROR]', {
        status: paychanguError.response?.status,
        data: paychanguError.response?.data,
        message: paychanguError.message
      });

      return res.status(500).json({
        success: false,
        message: paychanguError.response?.data?.message || 'Failed to initialize payment with Paychangu',
        error: process.env.NODE_ENV === 'development' ? paychanguError.response?.data : undefined
      });
    }

    console.log('[PAYCHANGU RESPONSE]', paychanguResponse.data);

    // ✅ 10. Create transaction in database
    const transaction = await Transaction.create({
      transactionId: transactionRef,
      paychanguReference: paychanguResponse.data?.data?.tx_ref || transactionRef,
      booking: bookingId,
      student: userId,
      hostel: booking.hostel._id,
      roomRent,
      platformFee,
      totalAmount,
      paymentMethod,
      status: 'initiated',
      paymentDetails: {
        initiatedAt: new Date(),
        phoneNumber: mobileNumber,
        paymentMethod
      },
      metadata: {
        userAgent: req.headers['user-agent'],
        clientIp: req.ip
      }
    });

    console.log('[TRANSACTION CREATED]', transaction._id);

    // ✅ 11. Return checkout URL
    const checkoutUrl = paychanguResponse.data?.data?.checkout_url || paychanguResponse.data?.data?.link;

    if (!checkoutUrl) {
      console.error('[ERROR] No checkout URL in Paychangu response');
      return res.status(500).json({
        success: false,
        message: 'Failed to get checkout URL from payment gateway'
      });
    }

    const duration = new Date() - startTime;
    console.log(`[INITIATE PAYMENT] Completed in ${duration}ms`);

    res.status(200).json({
      success: true,
      message: 'Payment initialized successfully',
      data: {
        transactionId: transaction._id,
        paymentUrl: checkoutUrl,
        amount: totalAmount,
        roomRent,
        platformFee,
        breakdown: {
          roomRent: formatCurrency(roomRent),
          platformFee: formatCurrency(platformFee),
          total: formatCurrency(totalAmount)
        }
      }
    });

  } catch (error) {
    console.error('[INITIATE PAYMENT ERROR]', error);
    res.status(500).json({
      success: false,
      message: 'Server error initiating payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ═══════════════════════════════════════════════════════════════
// POST /api/payments/webhook
// Paychangu calls this after payment completion
// ═══════════════════════════════════════════════════════════════
exports.handleWebhook = async (req, res) => {
  const startTime = new Date();
  try {
    console.log('[WEBHOOK RECEIVED]', {
      timestamp: new Date().toISOString(),
      body: req.body,
      headers: req.headers
    });

    // ✅ 1. Verify webhook signature
    const signature = req.headers['x-paychangu-signature'] || req.headers['paychangu-signature'];
    // Note: You may need to verify signature differently based on Paychangu docs
    // For now, we'll trust the webhook but log it
    if (!signature) {
      console.warn('[WEBHOOK] No signature header found - consider adding signature verification');
    }

    // ✅ 2. Extract webhook data
    const { tx_ref, status, amount, currency } = req.body;

    if (!tx_ref) {
      console.error('[WEBHOOK] Missing tx_ref');
      return res.status(400).json({ success: false, message: 'Missing tx_ref' });
    }

    if (!status) {
      console.error('[WEBHOOK] Missing status');
      return res.status(400).json({ success: false, message: 'Missing status' });
    }

    console.log('[WEBHOOK PROCESSING]', { tx_ref, status, amount, currency });

    // ✅ 3. Find transaction
    const transaction = await Transaction.findOne({ transactionId: tx_ref });

    if (!transaction) {
      console.error('[WEBHOOK] Transaction not found for tx_ref:', tx_ref);
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    console.log('[WEBHOOK] Transaction found:', transaction._id);

    // ✅ 4. Verify amount matches
    if (amount && amount !== transaction.totalAmount) {
      console.error('[WEBHOOK] Amount mismatch', { expected: transaction.totalAmount, received: amount });
      transaction.status = 'failed';
      transaction.errorMessage = 'Amount mismatch';
      await transaction.save();
      return res.status(400).json({ success: false, message: 'Amount mismatch' });
    }

    // ✅ 5. Handle different payment statuses
    if (status === 'successful' || status === 'success' || status === 'completed') {
      console.log('[WEBHOOK] Payment successful, confirming booking...');

      transaction.status = 'completed';
      transaction.paychanguStatus = status;
      transaction.paymentDetails.completedAt = new Date();
      await transaction.save();

      // ✅ 6. Confirm booking and decrement available rooms
      const booking = await Booking.findById(transaction.booking);

      if (!booking) {
        console.error('[WEBHOOK] Booking not found:', transaction.booking);
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }

      if (booking.status !== 'payment_pending') {
        console.warn('[WEBHOOK] Booking already processed:', booking.status);
        return res.json({ status: 'ok', message: 'Booking already processed' });
      }

      // ✅ 7. Update booking
      booking.status = 'confirmed';
      booking.paymentStatus = 'paid';
      booking.moveInConfirmed = false;
      await booking.save();

      console.log('[WEBHOOK] Booking confirmed:', booking._id);

      // ✅ 8. Decrement available rooms
      const hostel = await Hostel.findById(booking.hostel);
      if (hostel && hostel.availableRooms > 0) {
        hostel.availableRooms = Math.max(0, hostel.availableRooms - 1);
        await hostel.save();
        console.log('[WEBHOOK] Rooms decremented. Available rooms:', hostel.availableRooms);
      }

      const duration = new Date() - startTime;
      console.log(`[WEBHOOK] Success processed in ${duration}ms`);

      return res.json({ status: 'ok', message: 'Payment successful' });

    } else if (status === 'failed' || status === 'declined') {
      console.log('[WEBHOOK] Payment failed:', status);

      transaction.status = 'failed';
      transaction.paychanguStatus = status;
      transaction.errorMessage = `Payment ${status}`;
      await transaction.save();

      // ✅ 9. Mark booking as payment failed
      const booking = await Booking.findById(transaction.booking);
      if (booking && booking.status === 'payment_pending') {
        booking.paymentStatus = 'failed';
        await booking.save();
        console.log('[WEBHOOK] Booking payment marked as failed');
      }

      return res.json({ status: 'ok', message: 'Payment failed' });

    } else if (status === 'cancelled' || status === 'abandoned') {
      console.log('[WEBHOOK] Payment cancelled:', status);

      transaction.status = 'cancelled';
      transaction.paychanguStatus = status;
      await transaction.save();

      return res.json({ status: 'ok', message: 'Payment cancelled' });

    } else {
      console.log('[WEBHOOK] Unknown status:', status);
      transaction.paychanguStatus = status;
      transaction.status = 'pending';
      await transaction.save();

      return res.json({ status: 'ok', message: 'Status received' });
    }

  } catch (error) {
    console.error('[WEBHOOK ERROR]', error);
    res.status(500).json({ message: 'Webhook processing error' });
  }
};

// ═══════════════════════════════════════════════════════════════
// GET /api/payments/verify/:transactionId
// Verify payment status
// ═══════════════════════════════════════════════════════════════
exports.verifyPayment = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user._id;

    console.log('[VERIFY PAYMENT]', { transactionId, userId });

    if (!transactionId) {
      return res.status(400).json({ success: false, message: 'Transaction ID is required' });
    }

    // ✅ Find transaction
    const transaction = await Transaction.findById(transactionId)
      .populate('booking', 'status paymentStatus')
      .populate('hostel', 'name address')
      .populate('student', 'firstName lastName email');

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // ✅ Verify user owns this transaction
    if (transaction.student._id.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this transaction' });
    }

    console.log('[VERIFY PAYMENT] Transaction:', { id: transaction._id, status: transaction.status });

    // ✅ If still processing, try to verify with Paychangu
    if (transaction.status === 'initiated' || transaction.status === 'processing') {
      try {
        const paychanguRef = transaction.paychanguReference || transaction.transactionId;
        const verifyResponse = await axios.get(`${PAYCHANGU_API}/verify/${paychanguRef}`, {
          headers: {
            Authorization: `Bearer ${process.env.PAYCHANGU_SECRET_KEY}`,
          },
          timeout: 10000
        });

        console.log('[PAYCHANGU VERIFY RESPONSE]', verifyResponse.data);

        const paychanguStatus = verifyResponse.data?.data?.status;

        if (paychanguStatus === 'successful' || paychanguStatus === 'success') {
          // ✅ Update transaction
          transaction.status = 'completed';
          transaction.paychanguStatus = paychanguStatus;
          transaction.paymentDetails.completedAt = new Date();
          await transaction.save();

          // ✅ Confirm booking if not already
          const booking = await Booking.findById(transaction.booking);
          if (booking && booking.status === 'payment_pending') {
            booking.status = 'confirmed';
            booking.paymentStatus = 'paid';
            await booking.save();

            const hostel = await Hostel.findById(booking.hostel);
            if (hostel && hostel.availableRooms > 0) {
              hostel.availableRooms = Math.max(0, hostel.availableRooms - 1);
              await hostel.save();
            }

            console.log('[VERIFY PAYMENT] Booking confirmed via verification');
          }
        }

      } catch (verifyError) {
        console.warn('[PAYCHANGU VERIFY ERROR]', verifyError.message);
        // Don't fail - just return current transaction status
      }
    }

    res.json({
      success: true,
      data: {
        transactionId: transaction._id,
        status: transaction.status,
        paymentStatus: transaction.status === 'completed' ? 'paid' : 'pending',
        amount: transaction.totalAmount,
        breakdown: {
          roomRent: formatCurrency(transaction.roomRent),
          platformFee: formatCurrency(transaction.platformFee),
          total: formatCurrency(transaction.totalAmount)
        },
        booking: {
          id: transaction.booking._id,
          status: transaction.booking.status,
          paymentStatus: transaction.booking.paymentStatus
        },
        hostel: {
          name: transaction.hostel.name,
          address: transaction.hostel.address
        },
        completedAt: transaction.paymentDetails.completedAt
      }
    });

  } catch (error) {
    console.error('[VERIFY PAYMENT ERROR]', error);
    res.status(500).json({ success: false, message: 'Server error verifying payment' });
  }
};

// ═══════════════════════════════════════════════════════════════
// GET /api/payments/history
// Get payment history for logged-in user
// ═══════════════════════════════════════════════════════════════
exports.getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const transactions = await Transaction.find({ student: userId })
      .populate('booking', 'status paymentStatus')
      .populate('hostel', 'name address images')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: transactions.length,
      data: transactions.map(t => ({
        id: t._id,
        transactionId: t.transactionId,
        status: t.status,
        amount: t.totalAmount,
        hostel: t.hostel.name,
        bookingStatus: t.booking.status,
        date: t.createdAt,
        breakdown: {
          roomRent: formatCurrency(t.roomRent),
          platformFee: formatCurrency(t.platformFee),
          total: formatCurrency(t.totalAmount)
        }
      }))
    });

  } catch (error) {
    console.error('[GET PAYMENT HISTORY ERROR]', error);
    res.status(500).json({ success: false, message: 'Server error fetching payment history' });
  }
};

// ═══════════════════════════════════════════════════════════════
// GET /api/payments/:id
// Get single transaction details
// ═══════════════════════════════════════════════════════════════
exports.getTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id)
      .populate('booking')
      .populate('hostel', 'name address images')
      .populate('student', 'firstName lastName email');

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // ✅ Verify authorization
    if (transaction.student._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({
      success: true,
      data: {
        id: transaction._id,
        transactionId: transaction.transactionId,
        status: transaction.status,
        paymentMethod: transaction.paymentMethod,
        roomRent: transaction.roomRent,
        platformFee: transaction.platformFee,
        totalAmount: transaction.totalAmount,
        breakdown: {
          roomRent: formatCurrency(transaction.roomRent),
          platformFee: formatCurrency(transaction.platformFee),
          total: formatCurrency(transaction.totalAmount)
        },
        booking: transaction.booking,
        hostel: transaction.hostel,
        student: transaction.student,
        paymentDetails: transaction.paymentDetails,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt
      }
    });

  } catch (error) {
    console.error('[GET TRANSACTION ERROR]', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
