const Notification = require('../models/Notification');

// @desc  Get all notifications for logged-in user
// @route GET /api/notifications
// @access Private
exports.getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('sender', 'firstName lastName profilePicture role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Notification.countDocuments({ recipient: req.user._id });
    const unread = await Notification.countDocuments({
      recipient: req.user._id,
      read: false,
    });

    res.json({
      success: true,
      data: notifications,
      unread,
      total,
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error('getNotifications error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc  Get unread notification count
// @route GET /api/notifications/unread-count
// @access Private
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user._id,
      read: false,
    });
    res.json({ success: true, count });
  } catch (error) {
    console.error('getUnreadCount error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc  Mark a notification as read
// @route PUT /api/notifications/:id/read
// @access Private
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    res.json({ success: true, data: notification });
  } catch (error) {
    console.error('markAsRead error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc  Mark all notifications as read
// @route PUT /api/notifications/read-all
// @access Private
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true }
    );
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('markAllAsRead error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc  Delete a notification
// @route DELETE /api/notifications/:id
// @access Private
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    console.error('deleteNotification error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc  Delete all notifications
// @route DELETE /api/notifications/delete-all
// @access Private
exports.deleteAll = async (req, res) => {
  try {
    await Notification.deleteMany({ recipient: req.user._id });
    res.json({ success: true, message: 'All notifications deleted' });
  } catch (error) {
    console.error('deleteAll error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── HELPER: Create notification + emit via socket ──
exports.createNotification = async ({
  recipientId,
  senderId,
  type,
  title,
  body,
  link = '',
  data = {},
  io,
  onlineUsers,
}) => {
  try {
    const notification = await Notification.create({
      recipient: recipientId,
      sender: senderId,
      type,
      title,
      body,
      link,
      data,
    });

    const populated = await Notification.findById(notification._id)
      .populate('sender', 'firstName lastName profilePicture role');

    // Emit real-time notification if user is online
    if (io && onlineUsers) {
      const recipientSocketId = onlineUsers.get(recipientId.toString());
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('notification:new', populated);
      }
    }

    return populated;
  } catch (error) {
    console.error('createNotification helper error:', error);
  }
};