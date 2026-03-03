const axios = require('axios');
const Transaction = require('../models/Transaction');
const Booking = require('../models/Booking');
const Hostel = require('../models/Hostel');

const PAYCHANGU_BASE = 'https://api.paychangu.com';
const PLATFORM_FEE = 2000; // MWK

// @desc  Initiate payment via Paychangu
// @route POST /api/payments/initiate
exports.initiatePayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod = 'mobile_money', mobileNumber } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate('hostel', 'name price owner')
      .populate('student', 'firstName lastName email phone');

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'Booking is already paid' });
    }

    const roomRent = booking.hostel.price * booking.duration;
    const totalAmount = roomRent + PLATFORM_FEE;

    // Create transaction record
    const transaction = await Transaction.create({
      booking: booking._id,
      student: req.user._id,
      hostel: booking.hostel._id,
      landlord: booking.hostel.owner,
      roomRent,
      platformFee: PLATFORM_FEE,
      totalAmount,
      paymentMethod,
      status: 'initiated',
    });

    // Call Paychangu API
    const paychanguPayload = {
      amount: totalAmount,
      currency: 'MWK',
      email: booking.student.email,
      first_name: booking.student.firstName,
      last_name: booking.student.lastName,
      callback_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payments/webhook`,
      return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/confirm/${transaction._id}`,
      tx_ref: transaction._id.toString(),
      title: `HostelLink - ${booking.hostel.name}`,
      description: `Room booking payment for ${booking.hostel.name}`,
      ...(paymentMethod === 'mobile_money' && mobileNumber ? { mobile_money: { operator: 'airtel', number: mobileNumber } } : {}),
    };

    const response = await axios.post(`${PAYCHANGU_BASE}/payment`, paychanguPayload, {
      headers: {
        Authorization: `Bearer ${process.env.PAYCHANGU_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const paychanguData = response.data;

    transaction.paychanguRef = paychanguData.data?.tx_ref || transaction._id.toString();
    transaction.status = 'processing';
    await transaction.save();

    res.json({
      success: true,
      paymentUrl: paychanguData.data?.checkout_url || paychanguData.data?.link,
      transactionId: transaction._id,
      amount: totalAmount,
      data: transaction,
    });
  } catch (error) {
    console.error('initiatePayment error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Payment initiation failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc  Paychangu webhook - called by Paychangu on payment completion
// @route POST /api/payments/webhook
exports.handleWebhook = async (req, res) => {
  try {
    const { tx_ref, status, amount, currency } = req.body;

    if (!tx_ref) return res.status(400).json({ message: 'Missing tx_ref' });

    const transaction = await Transaction.findById(tx_ref);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    if (status === 'successful' || status === 'success') {
      transaction.status = 'completed';
      transaction.paidAt = new Date();
      await transaction.save();

      // Confirm the booking and decrement bed space
      const booking = await Booking.findById(transaction.booking);
      if (booking && booking.status === 'payment_pending') {
        const hostel = await Hostel.findById(booking.hostel);
        if (hostel && hostel.availableRooms > 0) {
          hostel.availableRooms = Math.max(0, hostel.availableRooms - 1);
          await hostel.save();
        }
        booking.status = 'confirmed';
        booking.paymentStatus = 'paid';
        await booking.save();
      }
    } else if (status === 'failed' || status === 'cancelled') {
      transaction.status = 'failed';
      await transaction.save();

      const booking = await Booking.findById(transaction.booking);
      if (booking) {
        booking.paymentStatus = 'failed';
        await booking.save();
      }
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(500).json({ message: 'Webhook processing error' });
  }
};

// @desc  Verify payment status
// @route GET /api/payments/verify/:transactionId
exports.verifyPayment = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.transactionId)
      .populate('booking')
      .populate('hostel', 'name address');

    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });

    if (transaction.student.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Double-check with Paychangu if still processing
    if (transaction.status === 'processing' && process.env.PAYCHANGU_SECRET_KEY) {
      try {
        const verifyRes = await axios.get(`${PAYCHANGU_BASE}/verify-payment/${transaction.paychanguRef}`, {
          headers: { Authorization: `Bearer ${process.env.PAYCHANGU_SECRET_KEY}` },
        });
        const verifyData = verifyRes.data;
        if (verifyData.data?.status === 'successful') {
          transaction.status = 'completed';
          transaction.paidAt = new Date();
          await transaction.save();
        }
      } catch (verifyError) {
        console.error('Paychangu verify error:', verifyError.message);
      }
    }

    res.json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error verifying payment' });
  }
};

// @desc  Get payment history for logged-in user
// @route GET /api/payments/history
exports.getPaymentHistory = async (req, res) => {
  try {
    const query = req.user.role === 'student'
      ? { student: req.user._id }
      : { landlord: req.user._id };

    const transactions = await Transaction.find(query)
      .populate('booking')
      .populate('hostel', 'name address')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching payment history' });
  }
};

// @desc  Get single transaction
// @route GET /api/payments/:id
exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('booking')
      .populate('hostel', 'name address images')
      .populate('student', 'firstName lastName email');

    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });

    res.json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};