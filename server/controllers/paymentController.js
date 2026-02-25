const Transaction = require('../models/Transaction');
const Booking = require('../models/Booking');
const Hostel = require('../models/Hostel');
const User = require('../models/User');
const axios = require('axios');
const crypto = require('crypto');

// ============================================
// PAYCHANGE CONFIGURATION
// ============================================
const PAYCHANGE_CONFIG = {
  API_KEY: process.env.PAYCHANGE_API_KEY,
  MERCHANT_ID: process.env.PAYCHANGE_MERCHANT_ID,
  MERCHANT_KEY: process.env.PAYCHANGE_MERCHANT_KEY,
  API_URL: process.env.PAYCHANGE_API_URL || 'https://api.paychange.co.mw',
  CALLBACK_URL: `${process.env.API_URL}/api/payments/paychange-callback`,
  BOOKING_FEE: 2000 // MWK - Fixed platform fee per transaction
};

// ============================================
// HELPER FUNCTIONS
// ============================================

// Generate secure transaction ID
const generateTransactionId = () => {
  return `PC_${Date.now()}_${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
};

// Generate Paychange signature
const generatePaychangeSignature = (data) => {
  const signatureString = `${data.merchantId}${data.amount}${data.transactionId}${PAYCHANGE_CONFIG.MERCHANT_KEY}`;
  return crypto.createHash('sha256').update(signatureString).digest('hex');
};

// Verify Paychange callback signature
const verifyPaychangeSignature = (data, signature) => {
  const signatureString = `${data.merchantId}${data.amount}${data.transactionId}${PAYCHANGE_CONFIG.MERCHANT_KEY}`;
  const expectedSignature = crypto.createHash('sha256').update(signatureString).digest('hex');
  return signature === expectedSignature;
};

// Log transaction for audit
const logTransaction = async (transactionId, action, details) => {
  console.log(`[TRANSACTION] ${transactionId} - ${action}:`, details);
};

// ============================================
// INITIATE PAYMENT ENDPOINT
// ============================================
exports.initiatePayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod, phoneNumber } = req.body;
    const userId = req.user._id;

    // Validation
    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID is required'
      });
    }

    if (!paymentMethod || !['mobile_money', 'bank_transfer', 'card'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Valid payment method required: mobile_money, bank_transfer, or card'
      });
    }

    // Get booking with hostel details
    const booking = await Booking.findById(bookingId).populate('hostel');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify booking belongs to student
    if (booking.student.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to process payment for this booking'
      });
    }

    // Check booking status - can only pay if pending
    if (booking.paymentStatus && booking.paymentStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot pay for booking with status: ${booking.paymentStatus}`
      });
    }

    // Check if payment already in progress
    const existingTransaction = await Transaction.findOne({
      booking: bookingId,
      status: { $in: ['initiated', 'processing'] }
    });

    if (existingTransaction) {
      return res.status(400).json({
        success: false,
        message: 'Payment is already in progress for this booking',
        transactionId: existingTransaction._id
      });
    }

    // Calculate amounts
    const roomRent = booking.hostel.price;
    const platformFee = PAYCHANGE_CONFIG.BOOKING_FEE;
    const totalAmount = roomRent + platformFee;

    // Create transaction record
    const transactionId = generateTransactionId();
    const transaction = await Transaction.create({
      transactionId,
      booking: bookingId,
      student: userId,
      hostel: booking.hostel._id,
      roomRent,
      platformFee,
      totalAmount,
      paymentMethod,
      status: 'initiated',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      paymentDetails: {
        initiatedAt: new Date(),
        paymentMethod,
        phoneNumber: paymentMethod === 'mobile_money' ? phoneNumber : undefined
      },
      metadata: {
        clientIp: req.ip,
        userAgent: req.get('user-agent'),
        platform: 'web'
      }
    });

    await logTransaction(transactionId, 'INITIATED', {
      bookingId,
      totalAmount,
      roomRent,
      platformFee,
      paymentMethod
    });

    // Prepare Paychange request
    const paychangePayload = {
      merchantId: PAYCHANGE_CONFIG.MERCHANT_ID,
      transactionId,
      amount: totalAmount,
      paymentMethod,
      description: `Hostel Booking - ${booking.hostel.name}`,
      customerName: `${req.user.firstName} ${req.user.lastName}`,
      customerEmail: req.user.email,
      customerPhone: req.user.phone || phoneNumber,
      returnUrl: `${process.env.FRONTEND_URL}/payment/confirm/${transaction._id}`,
      callbackUrl: PAYCHANGE_CONFIG.CALLBACK_URL,
      metadata: {
        transactionId: transaction._id.toString(),
        bookingId: booking._id.toString(),
        roomRent,
        platformFee,
        studentId: userId.toString()
      }
    };

    // Add signature
    paychangePayload.signature = generatePaychangeSignature(paychangePayload);

    // Call Paychange API
    let paychangeResponse;
    try {
      paychangeResponse = await axios.post(
        `${PAYCHANGE_CONFIG.API_URL}/api/transactions/initiate`,
        paychangePayload,
        {
          headers: {
            'Authorization': `Bearer ${PAYCHANGE_CONFIG.API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );
    } catch (error) {
      await logTransaction(transactionId, 'PAYCHANGE_ERROR', {
        error: error.message,
        statusCode: error.response?.status
      });

      await Transaction.findByIdAndUpdate(transaction._id, {
        status: 'failed',
        errorMessage: error.response?.data?.message || error.message,
        errorCode: error.response?.status
      });

      return res.status(400).json({
        success: false,
        message: 'Failed to initiate payment with Paychange',
        error: error.response?.data?.message || error.message
      });
    }

    if (!paychangeResponse.data.success) {
      await logTransaction(transactionId, 'PAYCHANGE_REJECTED', {
        message: paychangeResponse.data.message
      });

      await Transaction.findByIdAndUpdate(transaction._id, {
        status: 'failed',
        errorMessage: paychangeResponse.data.message
      });

      return res.status(400).json({
        success: false,
        message: paychangeResponse.data.message || 'Payment initiation failed'
      });
    }

    // Update transaction with Paychange reference
    await Transaction.findByIdAndUpdate(transaction._id, {
      status: 'processing',
      paychangeReference: paychangeResponse.data.reference,
      paychangeTransactionId: paychangeResponse.data.transactionId
    });

    await logTransaction(transactionId, 'PAYCHANGE_INITIATED', {
      paychangeReference: paychangeResponse.data.reference,
      paymentUrl: paychangeResponse.data.paymentUrl
    });

    return res.status(200).json({
      success: true,
      message: 'Payment initiated successfully',
      data: {
        transactionId: transaction._id,
        paymentId: transaction.transactionId,
        paymentUrl: paychangeResponse.data.paymentUrl,
        paymentDetails: {
          amount: totalAmount,
          roomRent,
          platformFee: `${platformFee} MWK (Platform fee)`,
          total: `${totalAmount} MWK`,
          currency: 'MWK',
          hostel: booking.hostel.name
        },
        expiresIn: 3600
      }
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error initiating payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ============================================
// PAYCHANGE CALLBACK HANDLER (WEBHOOK)
// ============================================
exports.handlePaychangeCallback = async (req, res) => {
  try {
    const callbackData = req.body;
    
    console.log('Paychange callback received:', callbackData);

    // Verify signature for security
    if (!verifyPaychangeSignature(callbackData, callbackData.signature)) {
      console.error('Invalid Paychange callback signature');
      return res.status(401).json({
        success: false,
        message: 'Invalid signature'
      });
    }

    const { transactionId, status, reference, amount } = callbackData;

    // Find transaction
    const transaction = await Transaction.findOne({ transactionId });

    if (!transaction) {
      console.error(`Transaction not found: ${transactionId}`);
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Validate amount matches
    if (amount !== transaction.totalAmount) {
      console.error(`Amount mismatch for ${transactionId}`);
      
      await Transaction.findByIdAndUpdate(transaction._id, {
        status: 'failed',
        errorMessage: 'Amount mismatch - potential fraud'
      });

      return res.status(400).json({
        success: false,
        message: 'Amount verification failed'
      });
    }

    // Determine payment status
    const isSuccess = status === 'success' || status === 'completed' || status === 'confirmed';
    const finalStatus = isSuccess ? 'completed' : 'failed';

    // Update transaction
    const updateData = {
      status: finalStatus,
      paychangeStatus: status,
      paychangeReference: reference,
      verified: true
    };

    if (isSuccess) {
      updateData['paymentDetails.completedAt'] = new Date();
    }

    await Transaction.findByIdAndUpdate(transaction._id, updateData);

    await logTransaction(transactionId, `PAYMENT_${status.toUpperCase()}`, {
      reference,
      amount,
      finalStatus
    });

    // If successful, update booking and hostel
    if (isSuccess) {
      try {
        const booking = await Booking.findById(transaction.booking);

        if (booking) {
          booking.paymentStatus = 'completed';
          booking.transactionId = transaction._id;
          booking.bookingStatus = 'confirmed';
          booking.confirmedAt = new Date();
          await booking.save();

          // Decrease available rooms
          await Hostel.findByIdAndUpdate(booking.hostel, {
            $inc: { availableRooms: -1 }
          });

          await logTransaction(transactionId, 'BOOKING_CONFIRMED', {
            bookingId: booking._id,
            hostelId: booking.hostel
          });
        }
      } catch (bookingError) {
        console.error('Error updating booking after payment:', bookingError);
      }
    }

    // CRITICAL: Always return 200 OK to Paychange
    return res.status(200).json({
      success: true,
      message: 'Callback processed successfully',
      transactionId
    });
  } catch (error) {
    console.error('Paychange callback error:', error);
    return res.status(200).json({
      success: false,
      message: 'Callback processing error'
    });
  }
};

// ============================================
// VERIFY PAYMENT STATUS
// ============================================
exports.verifyPayment = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user._id;

    const transaction = await Transaction.findById(transactionId).populate([
      { path: 'booking' },
      { path: 'hostel', select: 'name' }
    ]);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    if (transaction.student.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this transaction'
      });
    }

    res.json({
      success: true,
      transaction: {
        _id: transaction._id,
        transactionId: transaction.transactionId,
        status: transaction.status,
        totalAmount: transaction.totalAmount,
        roomRent: transaction.roomRent,
        platformFee: transaction.platformFee,
        paymentMethod: transaction.paymentMethod,
        hostel: transaction.hostel.name,
        bookingStatus: transaction.booking.bookingStatus,
        createdAt: transaction.createdAt,
        completedAt: transaction.paymentDetails?.completedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying payment'
    });
  }
};

// ============================================
// GET USER TRANSACTIONS
// ============================================
exports.getUserTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { student: userId };
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const transactions = await Transaction.find(query)
      .populate('hostel', 'name price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching transactions'
    });
  }
};