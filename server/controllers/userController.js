const User = require('../models/User');
const Booking = require('../models/Booking');
const Hostel = require('../models/Hostel');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// @desc  Get user profile
// @route GET /api/users/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc  Update user profile
// @route PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = ['firstName', 'lastName', 'phone', 'profilePicture', 'studentId', 'bio'];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
};

// @desc  Upload profile picture
// @route PUT /api/users/profile/avatar
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'avatars',
            transformation: [{ width: 400, height: 400, crop: 'fill' }],
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await streamUpload();

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture: result.secure_url },
      { new: true }
    );

    res.json({ success: true, user });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload image' });
  }
};

// @desc  Change password
// @route PUT /api/users/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new password' });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error changing password' });
  }
};

// @desc  Get student dashboard stats
// @route GET /api/users/dashboard/student
exports.getStudentDashboard = async (req, res) => {
  try {
    const bookings = await Booking.find({ student: req.user._id })
      .populate('hostel', 'name address images price')
      .sort({ createdAt: -1 });

    const stats = {
      totalBookings: bookings.length,
      activeBookings: bookings.filter((b) => ['confirmed', 'active'].includes(b.status)).length,
      pendingBookings: bookings.filter((b) => b.status === 'payment_pending').length,
      completedBookings: bookings.filter((b) => b.status === 'completed').length,
      cancelledBookings: bookings.filter((b) => b.status === 'cancelled').length,
    };

    res.json({ success: true, stats, recentBookings: bookings.slice(0, 5) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching dashboard' });
  }
};

// @desc  Get landlord dashboard stats
// @route GET /api/users/dashboard/landlord
exports.getLandlordDashboard = async (req, res) => {
  try {
    const hostels = await Hostel.find({ owner: req.user._id });
    const hostelIds = hostels.map((h) => h._id);

    const bookings = await Booking.find({ hostel: { $in: hostelIds } })
      .populate('hostel', 'name')
      .populate('student', 'firstName lastName email phone')
      .sort({ createdAt: -1 });

    const totalRooms = hostels.reduce((sum, h) => sum + (h.totalRooms || 0), 0);
    const availableRooms = hostels.reduce((sum, h) => sum + (h.availableRooms || 0), 0);

    const stats = {
      totalHostels: hostels.length,
      totalRooms,
      availableRooms,
      occupiedRooms: totalRooms - availableRooms,
      totalBookings: bookings.length,
      confirmedBookings: bookings.filter((b) => ['confirmed', 'active'].includes(b.status)).length,
      pendingBookings: bookings.filter((b) => b.status === 'payment_pending').length,
    };

    res.json({ success: true, stats, hostels, recentBookings: bookings.slice(0, 10) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching landlord dashboard' });
  }
};

// @desc  Get all users (admin only)
// @route GET /api/users
exports.getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const query = role ? { role } : {};
    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 });
    res.json({ success: true, total, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc  Delete user account
// @route DELETE /api/users/account
exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isActive: false });
    res.json({ success: true, message: 'Account deactivated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};