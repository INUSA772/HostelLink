const Booking = require('../models/Booking');
const Hostel = require('../models/Hostel');
const Transaction = require('../models/Transaction');

// @desc  Create a new booking
// @route POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const { hostelId, checkIn: checkInRaw, checkInDate, duration, roomType, specialRequests } = req.body;
    const checkIn = checkInRaw || checkInDate; // ← accept both field names

    if (!checkIn) {
      return res.status(400).json({ success: false, message: 'Check-in date is required' });
    }

    const hostel = await Hostel.findById(hostelId);
    if (!hostel) return res.status(404).json({ success: false, message: 'Hostel not found' });
    if (!hostel.isActive) return res.status(400).json({ success: false, message: 'Hostel is not available' });
    if (hostel.availableRooms < 1) return res.status(400).json({ success: false, message: 'No rooms available in this hostel' });

    const existing = await Booking.findOne({
      student: req.user._id,
      hostel: hostelId,
      status: { $in: ['payment_pending', 'confirmed', 'active'] },
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You already have an active booking at this hostel' });
    }

    const booking = await Booking.create({
      student: req.user._id,
      hostel: hostelId,
      checkIn,
      duration: duration || 1,
      roomType,
      specialRequests,
      amount: hostel.price,
      status: 'payment_pending',
    });

    await booking.populate('hostel', 'name address price owner');
    await booking.populate('student', 'firstName lastName email phone');

    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error('createBooking error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error creating booking' });
  }
};

// @desc  Get all bookings for logged-in student
// @route GET /api/bookings/my-bookings
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ student: req.user._id })
      .populate('hostel', 'name address images price owner')
      .populate('student', 'firstName lastName email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching bookings' });
  }
};

// @desc  Get bookings for landlord's hostels
// @route GET /api/bookings/landlord-bookings
exports.getLandlordBookings = async (req, res) => {
  try {
    const myHostels = await Hostel.find({ owner: req.user._id }).select('_id');
    const hostelIds = myHostels.map((h) => h._id);

    const bookings = await Booking.find({ hostel: { $in: hostelIds } })
      .populate('hostel', 'name address price')
      .populate('student', 'firstName lastName email phone studentId')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching landlord bookings' });
  }
};

// @desc  Get single booking
// @route GET /api/bookings/:id
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('hostel', 'name address images price owner')
      .populate('student', 'firstName lastName email phone studentId');

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    const isStudent = booking.student._id.toString() === req.user._id.toString();
    const hostelOwner = await Hostel.findById(booking.hostel._id).select('owner');
    const isOwner = hostelOwner && hostelOwner.owner.toString() === req.user._id.toString();

    if (!isStudent && !isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching booking' });
  }
};

// @desc  Confirm booking after successful payment
// @route PUT /api/bookings/:id/confirm
exports.confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    if (booking.status === 'confirmed' || booking.status === 'active') {
      return res.status(400).json({ success: false, message: 'Booking is already confirmed' });
    }

    const hostel = await Hostel.findById(booking.hostel);
    if (!hostel) return res.status(404).json({ success: false, message: 'Hostel not found' });

    if (hostel.availableRooms < 1) {
      booking.status = 'cancelled';
      await booking.save();
      return res.status(400).json({ success: false, message: 'No rooms available. Booking cancelled.' });
    }

    hostel.availableRooms = Math.max(0, hostel.availableRooms - 1);
    await hostel.save();

    booking.status = 'confirmed';
    booking.paymentStatus = 'paid';
    await booking.save();

    await booking.populate('hostel', 'name address');
    await booking.populate('student', 'firstName lastName email phone');

    res.json({ success: true, message: 'Booking confirmed successfully', data: booking });
  } catch (error) {
    console.error('confirmBooking error:', error);
    res.status(500).json({ success: false, message: 'Server error confirming booking' });
  }
};

// @desc  Cancel booking
// @route PUT /api/bookings/:id/cancel
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    const isStudent = booking.student.toString() === req.user._id.toString();
    const hostel = await Hostel.findById(booking.hostel);
    const isOwner = hostel && hostel.owner.toString() === req.user._id.toString();

    if (!isStudent && !isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }

    if (['cancelled', 'completed'].includes(booking.status)) {
      return res.status(400).json({ success: false, message: `Booking is already ${booking.status}` });
    }

    if (['confirmed', 'active'].includes(booking.status) && hostel) {
      hostel.availableRooms = Math.min(hostel.totalRooms, hostel.availableRooms + 1);
      await hostel.save();
    }

    booking.status = 'cancelled';
    booking.cancellationReason = req.body.reason || 'Cancelled by user';
    await booking.save();

    res.json({ success: true, message: 'Booking cancelled successfully', data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error cancelling booking' });
  }
};

// @desc  Get all bookings (admin only)
// @route GET /api/bookings
exports.getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Booking.countDocuments(query);

    const bookings = await Booking.find(query)
      .populate('hostel', 'name address')
      .populate('student', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ success: true, total, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};