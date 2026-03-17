const User = require('../models/User');
const Hostel = require('../models/Hostel');
const Booking = require('../models/Booking');

// @desc  Get all admin stats
// @route GET /api/admin/stats
exports.getAdminStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const totalUsers     = await User.countDocuments({ role: { $ne: 'admin' } });
    const totalStudents  = await User.countDocuments({ role: 'student' });
    const totalOwners    = await User.countDocuments({ role: 'owner' });
    const newUsersToday  = await User.countDocuments({ createdAt: { $gte: startOfToday } });

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
      .select('firstName lastName email phone role isActive createdAt verified')
      .sort({ createdAt: -1 })
      .limit(10);

    const allUsers = await User.find({ role: { $ne: 'admin' } })
      .select('firstName lastName email phone role isActive createdAt verified')
      .sort({ createdAt: -1 })
      .limit(50);

    const recentBookings = await Booking.find()
      .populate('student', 'firstName lastName email')
      .populate('hostel',  'name address')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      stats: {
        totalUsers, newUsersToday, totalHostels, activeHostels,
        totalBookings, confirmedBookings, pendingBookings,
        activeBookings, completedBookings, cancelledBookings, totalRevenue,
      },
      roleBreakdown: { students: totalStudents, owners: totalOwners },
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