const User = require('../models/User');
const Booking = require('../models/Booking');
const Hostel = require('../models/Hostel');
const { v2: cloudinary } = require('cloudinary');
const streamifier = require('streamifier');

// ── CLOUDINARY CONFIG (lazy - only when needed) ──
const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

// ── HELPER: stream buffer to cloudinary ──────────
const streamUpload = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'pezahostel/avatars',
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

// ── GET PROFILE ───────────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    console.error('getProfile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── UPDATE PROFILE ────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = ['firstName', 'lastName', 'phone', 'studentId', 'bio'];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    delete updates.email;
    delete updates.role;
    delete updates.password;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, user, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('updateProfile error:', error);
    res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
};

// ── UPLOAD AVATAR ─────────────────────────────────
exports.updateAvatar = async (req, res) => {
  configureCloudinary(); // ← configure only when this route is hit
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const existingUser = await User.findById(req.user._id);
    if (existingUser?.profilePictureId) {
      try {
        await cloudinary.uploader.destroy(existingUser.profilePictureId);
      } catch (err) {
        console.warn('Could not delete old avatar:', err.message);
      }
    }

    const result = await streamUpload(req.file.buffer);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          profilePicture:   result.secure_url,
          profilePictureId: result.public_id,
        },
      },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({
      success: true,
      user,
      profilePicture: result.secure_url,
      message: 'Profile picture updated successfully',
    });
  } catch (error) {
    console.error('updateAvatar error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload image' });
  }
};

// ── CHANGE PASSWORD ───────────────────────────────
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new password' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('changePassword error:', error);
    res.status(500).json({ success: false, message: 'Server error changing password' });
  }
};

// ── STUDENT DASHBOARD ─────────────────────────────
exports.getStudentDashboard = async (req, res) => {
  try {
    const bookings = await Booking.find({ student: req.user._id })
      .populate('hostel', 'name address images price')
      .sort({ createdAt: -1 });

    const stats = {
      totalBookings:     bookings.length,
      activeBookings:    bookings.filter((b) => ['confirmed', 'active'].includes(b.status)).length,
      pendingBookings:   bookings.filter((b) => b.status === 'payment_pending').length,
      completedBookings: bookings.filter((b) => b.status === 'completed').length,
      cancelledBookings: bookings.filter((b) => b.status === 'cancelled').length,
    };

    res.json({ success: true, stats, recentBookings: bookings.slice(0, 5) });
  } catch (error) {
    console.error('getStudentDashboard error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching dashboard' });
  }
};

// ── LANDLORD DASHBOARD ────────────────────────────
exports.getLandlordDashboard = async (req, res) => {
  try {
    const hostels = await Hostel.find({ owner: req.user._id });
    const hostelIds = hostels.map((h) => h._id);

    const bookings = await Booking.find({ hostel: { $in: hostelIds } })
      .populate('hostel', 'name')
      .populate('student', 'firstName lastName email phone')
      .sort({ createdAt: -1 });

    const totalRooms     = hostels.reduce((sum, h) => sum + (h.totalRooms     || 0), 0);
    const availableRooms = hostels.reduce((sum, h) => sum + (h.availableRooms || 0), 0);

    const stats = {
      totalHostels:      hostels.length,
      totalRooms,
      availableRooms,
      occupiedRooms:     totalRooms - availableRooms,
      totalBookings:     bookings.length,
      confirmedBookings: bookings.filter((b) => ['confirmed', 'active'].includes(b.status)).length,
      pendingBookings:   bookings.filter((b) => b.status === 'payment_pending').length,
    };

    res.json({ success: true, stats, hostels, recentBookings: bookings.slice(0, 10) });
  } catch (error) {
    console.error('getLandlordDashboard error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching landlord dashboard' });
  }
};

// ── GET ALL USERS (Admin) ─────────────────────────
exports.getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const query = role ? { role } : {};
    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({ success: true, total, count: users.length, data: users });
  } catch (error) {
    console.error('getAllUsers error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── DELETE ACCOUNT ────────────────────────────────
exports.deleteAccount = async (req, res) => {
  configureCloudinary(); // ← configure only when this route is hit
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.profilePictureId) {
      try {
        await cloudinary.uploader.destroy(user.profilePictureId);
      } catch (err) {
        console.warn('Could not delete avatar:', err.message);
      }
    }

    await User.findByIdAndUpdate(req.user._id, { isActive: false });
    res.json({ success: true, message: 'Account deactivated successfully' });
  } catch (error) {
    console.error('deleteAccount error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};