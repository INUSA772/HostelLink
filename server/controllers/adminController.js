const User    = require('../models/User');
const Hostel  = require('../models/Hostel');
const Booking = require('../models/Booking');
const Visitor = require('../models/Visitor');

// @desc  Get all admin stats
// @route GET /api/admin/stats
exports.getAdminStats = async (req, res) => {
  try {
    const now          = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const totalUsers       = await User.countDocuments({ role: { $ne: 'admin' } });
    const totalLandlords   = await User.countDocuments({ role: 'landlord' });
    const totalLandSellers = await User.countDocuments({ role: 'land_seller' });
    const newUsersToday    = await User.countDocuments({ createdAt: { $gte: startOfToday } });

    const totalWhatsappClicks = await Hostel.aggregate([
      { $group: { _id: null, total: { $sum: { $ifNull: ['$whatsappClicks', 0] } } } },
    ]).then(r => r[0]?.total || 0);

    const totalHostels  = await Hostel.countDocuments();
    const activeHostels = await Hostel.countDocuments({ isActive: true });

    const totalBookings     = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const pendingBookings   = await Booking.countDocuments({ status: 'payment_pending' });
    const activeBookings    = await Booking.countDocuments({ status: 'active' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

    const revenueAgg = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'active', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // ── VISITOR STATS ──────────────────────────────────
    const totalVisitors   = await Visitor.countDocuments();
    const todayVisitors   = await Visitor.countDocuments({ lastSeen: { $gte: startOfToday } });
    const onlineNow       = await Visitor.countDocuments({ lastSeen: { $gte: fiveMinutesAgo } });

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const regAgg = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, role: { $ne: 'admin' } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const registrationsByMonth = regAgg.map(r => ({
      month: `${monthNames[r._id.month - 1]} ${r._id.year}`,
      count: r.count,
    }));

    const recentUsers = await User.find({ role: { $ne: 'admin' } })
      .select('firstName lastName email phone role isActive createdAt verified verificationStatus whatsapp')
      .sort({ createdAt: -1 })
      .limit(10);

    const allUsers = await User.find({ role: { $ne: 'admin' } })
      .select('firstName lastName email phone role isActive createdAt verified verificationStatus whatsapp')
      .sort({ createdAt: -1 })
      .limit(200);

    const recentBookings = await Booking.find()
      .populate('student', 'firstName lastName email')
      .populate('hostel',  'name address')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      stats: {
        totalUsers,
        newUsersToday,
        totalHostels,
        activeHostels,
        totalBookings,
        confirmedBookings,
        pendingBookings,
        activeBookings,
        completedBookings,
        cancelledBookings,
        totalRevenue,
        totalWhatsappClicks,
        // ── visitor stats ──
        totalVisitors,
        todayVisitors,
        onlineNow,
      },
      roleBreakdown: {
        landlords:   totalLandlords,
        landSellers: totalLandSellers,
      },
      registrationsByMonth,
      recentUsers,
      allUsers,
      recentBookings,
      reports: [],
    });
  } catch (error) {
    console.error('getAdminStats error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching admin stats' });
  }
};

// @desc  Get all users
// @route GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } })
      .select('firstName lastName email phone role isActive createdAt verified verificationStatus whatsapp')
      .sort({ createdAt: -1 })
      .limit(parseInt(req.query.limit) || 200);
    res.json({ success: true, users });
  } catch (error) {
    console.error('getUsers error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc  Verify or reject a user
// @route PATCH /api/admin/users/:id/verify
exports.verifyUser = async (req, res) => {
  try {
    const { action } = req.body;
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Action must be approve or reject' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.verificationStatus = action === 'approve' ? 'verified' : 'rejected';
    user.verified           = action === 'approve';
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, message: action === 'approve' ? 'User verified' : 'User rejected', user });
  } catch (error) {
    console.error('verifyUser error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc  Update user (activate/deactivate)
// @route PATCH /api/admin/users/:id
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: false });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    console.error('updateUser error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc  Delete a user
// @route DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    await Hostel.deleteMany({ owner: req.params.id });

    res.json({ success: true, message: 'User and their properties deleted' });
  } catch (error) {
    console.error('deleteUser error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc  Delete a hostel/property
// @route DELETE /api/admin/hostels/:id
exports.deleteHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findByIdAndDelete(req.params.id);
    if (!hostel) return res.status(404).json({ success: false, message: 'Property not found' });
    res.json({ success: true, message: 'Property deleted' });
  } catch (error) {
    console.error('deleteHostel error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc  Flag or unflag a hostel as scam
// @route PATCH /api/admin/hostels/:id/flag
exports.flagHostel = async (req, res) => {
  try {
    const { flagged, reason } = req.body;
    const hostel = await Hostel.findByIdAndUpdate(
      req.params.id,
      { flagged, flagReason: reason || '' },
      { new: true }
    );
    if (!hostel) return res.status(404).json({ success: false, message: 'Property not found' });
    res.json({ success: true, hostel });
  } catch (error) {
    console.error('flagHostel error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc  Track WhatsApp button click on a property
// @route POST /api/admin/hostels/:id/whatsapp-click
exports.trackWhatsappClick = async (req, res) => {
  try {
    await Hostel.findByIdAndUpdate(req.params.id, { $inc: { whatsappClicks: 1 } });
    res.json({ success: true });
  } catch (error) {
    console.error('trackWhatsappClick error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};