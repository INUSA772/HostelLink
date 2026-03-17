const axios = require('axios');
const crypto = require('crypto');
const Transaction = require('../models/Transaction');
const Booking = require('../models/Booking');
const Hostel = require('../models/Hostel');

const PAYCHANGU_API = process.env.PAYCHANGU_API_BASE || 'https://api.paychangu.com';
const PLATFORM_FEE = 2000;

const formatCurrency = (amount) => `MK ${Number(amount).toLocaleString()}`;

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/payments/initiate
// ─────────────────────────────────────────────────────────────────────────────
exports.initiatePayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod = 'mobile_money', mobileNumber } = req.body;
    const userId = req.user._id;

    if (!bookingId) {
      return res.status(400).json({ success: false, message: 'Booking ID is required' });
    }

    // Fetch booking
    const booking = await Booking.findById(bookingId)
      .populate('hostel', 'name price owner')
      .populate('student', 'firstName lastName email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.student._id.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (booking.paymentStatus === 'paid' || booking.status === 'confirmed') {
      return res.status(400).json({ success: false, message: 'This booking is already paid' });
    }

    const hostel = await Hostel.findById(booking.hostel._id);
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }

    // Calculate amounts
    const roomRent = hostel.price * (booking.duration || 1);
    const totalAmount = roomRent + PLATFORM_FEE;
    const transactionRef = `HL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Build Paychangu payload
    const paychanguPayload = {
      amount: totalAmount,
      currency: 'MWK',
      email: booking.student.email,
      first_name: booking.student.firstName,
      last_name: booking.student.lastName,
      phone_number: mobileNumber || booking.student.phone,
      callback_url: `${process.env.BACKEND_URL}/api/payments/webhook`,
      return_url: `${process.env.FRONTEND_URL}/payment/confirm/${transactionRef}`,
      tx_ref: transactionRef,
      customization: {
        title: `PezaHostel - ${hostel.name}`,
        description: `Room booking for ${booking.duration || 1} month(s) at ${hostel.name}`
      }
    };

    console.log('[PAYCHANGU REQUEST]', paychanguPayload);

    // Call Paychangu
    let paychanguResponse;
    try {
      paychanguResponse = await axios.post(
        `${PAYCHANGU_API}/payment`,
        paychanguPayload,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYCHANGU_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 15000
        }
      );
    } catch (paychanguError) {
      console.error('[PAYCHANGU ERROR]', {
        status: paychanguError.response?.status,
        data: paychanguError.response?.data,
        message: paychanguError.message
      });
      return res.status(500).json({
        success: false,
        message: paychanguError.response?.data?.message || 'Payment gateway error. Please try again.',
      });
    }

    console.log('[PAYCHANGU RESPONSE]', paychanguResponse.data);

    // Save transaction
    const transaction = await Transaction.create({
      transactionId: transactionRef,
      paychanguReference: paychanguResponse.data?.data?.tx_ref || transactionRef,
      booking: bookingId,
      student: userId,
      hostel: booking.hostel._id,
      roomRent,
      platformFee: PLATFORM_FEE,
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

    const checkoutUrl =
      paychanguResponse.data?.data?.checkout_url ||
      paychanguResponse.data?.data?.link ||
      paychanguResponse.data?.checkout_url ||
      paychanguResponse.data?.link;

    if (!checkoutUrl) {
      console.error('[ERROR] No checkout URL:', paychanguResponse.data);
      return res.status(500).json({
        success: false,
        message: 'Could not get payment URL from gateway. Please try again.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Payment initialized successfully',
      data: {
        transactionId: transaction._id,
        paymentUrl: checkoutUrl,
        amount: totalAmount,
        roomRent,
        platformFee: PLATFORM_FEE,
        breakdown: {
          roomRent: formatCurrency(roomRent),
          platformFee: formatCurrency(PLATFORM_FEE),
          total: formatCurrency(totalAmount)
        }
      }
    });

  } catch (error) {
    console.error('[INITIATE PAYMENT ERROR]', error);
    res.status(500).json({ success: false, message: 'Server error initiating payment' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/payments/webhook
// ─────────────────────────────────────────────────────────────────────────────
exports.handleWebhook = async (req, res) => {
  try {
    console.log('[WEBHOOK]', req.body);

    const { tx_ref, status, amount } = req.body;

    if (!tx_ref || !status) {
      return res.status(400).json({ success: false, message: 'Missing tx_ref or status' });
    }

    const transaction = await Transaction.findOne({ transactionId: tx_ref });
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (['successful', 'success', 'completed'].includes(status)) {
      transaction.status = 'completed';
      transaction.paychanguStatus = status;
      transaction.paymentDetails.completedAt = new Date();
      await transaction.save();

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
      }

      return res.json({ status: 'ok', message: 'Payment successful' });

    } else if (['failed', 'declined'].includes(status)) {
      transaction.status = 'failed';
      transaction.paychanguStatus = status;
      await transaction.save();

      const booking = await Booking.findById(transaction.booking);
      if (booking) {
        booking.paymentStatus = 'failed';
        await booking.save();
      }

      return res.json({ status: 'ok', message: 'Payment failed' });

    } else {
      transaction.paychanguStatus = status;
      await transaction.save();
      return res.json({ status: 'ok' });
    }

  } catch (error) {
    console.error('[WEBHOOK ERROR]', error);
    res.status(500).json({ message: 'Webhook error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/payments/verify/:transactionId
// ─────────────────────────────────────────────────────────────────────────────
exports.verifyPayment = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user._id;

    const transaction = await Transaction.findById(transactionId)
      .populate('booking', 'status paymentStatus checkIn duration')
      .populate('hostel', 'name address')
      .populate('student', 'firstName lastName email');

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (transaction.student._id.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Try to verify with Paychangu if still pending
    if (['initiated', 'processing'].includes(transaction.status)) {
      try {
        const verifyResponse = await axios.get(
          `${PAYCHANGU_API}/verify/${transaction.paychanguReference || transaction.transactionId}`,
          {
            headers: { Authorization: `Bearer ${process.env.PAYCHANGU_SECRET_KEY}` },
            timeout: 10000
          }
        );

        const paychanguStatus = verifyResponse.data?.data?.status;
        if (['successful', 'success'].includes(paychanguStatus)) {
          transaction.status = 'completed';
          transaction.paychanguStatus = paychanguStatus;
          transaction.paymentDetails.completedAt = new Date();
          await transaction.save();

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
          }
        }
      } catch (verifyError) {
        console.warn('[VERIFY ERROR]', verifyError.message);
      }
    }

    res.json({
      success: true,
      data: {
        transactionId: transaction._id,
        status: transaction.status,
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
        hostel: transaction.hostel,
        completedAt: transaction.paymentDetails?.completedAt
      }
    });

  } catch (error) {
    console.error('[VERIFY ERROR]', error);
    res.status(500).json({ success: false, message: 'Server error verifying payment' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/payments/history
// ─────────────────────────────────────────────────────────────────────────────
exports.getPaymentHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find({ student: req.user._id })
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
        hostel: t.hostel?.name,
        bookingStatus: t.booking?.status,
        date: t.createdAt,
        breakdown: {
          roomRent: formatCurrency(t.roomRent),
          platformFee: formatCurrency(t.platformFee),
          total: formatCurrency(t.totalAmount)
        }
      }))
    });

  } catch (error) {
    console.error('[PAYMENT HISTORY ERROR]', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/payments/:id
// ─────────────────────────────────────────────────────────────────────────────
exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('booking')
      .populate('hostel', 'name address images')
      .populate('student', 'firstName lastName email');

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

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
        createdAt: transaction.createdAt
      }
    });

  } catch (error) {
    console.error('[GET TRANSACTION ERROR]', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};