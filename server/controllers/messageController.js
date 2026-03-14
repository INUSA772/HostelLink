const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

// @desc  Start or get existing conversation
// @route POST /api/messages/conversation
// @access Private
exports.getOrCreateConversation = async (req, res) => {
  try {
    const { hostelId, ownerId } = req.body;
    const studentId = req.user._id;

    if (studentId.toString() === ownerId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot message yourself',
      });
    }

    let conversation = await Conversation.findOne({
      hostel: hostelId,
      participants: { $all: [studentId, ownerId] },
    })
      .populate('participants', 'firstName lastName profilePicture role')
      .populate('hostel', 'name address images');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [studentId, ownerId],
        hostel: hostelId,
        unreadCount: {
          [studentId]: 0,
          [ownerId]: 0,
        },
      });

      conversation = await Conversation.findById(conversation._id)
        .populate('participants', 'firstName lastName profilePicture role')
        .populate('hostel', 'name address images');
    }

    res.json({ success: true, data: conversation });
  } catch (error) {
    console.error('getOrCreateConversation error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc  Get all conversations for logged-in user
// @route GET /api/messages/conversations
// @access Private
exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
      isActive: true,
    })
      .populate('participants', 'firstName lastName profilePicture role')
      .populate('hostel', 'name address images')
      .populate('lastMessage.sender', 'firstName')
      .sort({ updatedAt: -1 });

    res.json({ success: true, data: conversations });
  } catch (error) {
    console.error('getConversations error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc  Get messages in a conversation
// @route GET /api/messages/:conversationId
// @access Private
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    const skip = (Number(page) - 1) * Number(limit);

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'firstName lastName profilePicture role')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(Number(limit));

    // Mark messages as read
    await Message.updateMany(
      {
        conversation: conversationId,
        sender: { $ne: req.user._id },
        read: false,
      },
      { read: true }
    );

    // Reset unread count
    await Conversation.findByIdAndUpdate(conversationId, {
      [`unreadCount.${req.user._id}`]: 0,
    });

    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('getMessages error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc  Send a message
// @route POST /api/messages/:conversationId
// @access Private
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message text is required',
      });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      text: text.trim(),
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'firstName lastName profilePicture role');

    const otherParticipant = conversation.participants.find(
      (p) => p.toString() !== req.user._id.toString()
    );

    const currentUnread = conversation.unreadCount?.get
      ? (conversation.unreadCount.get(otherParticipant.toString()) || 0)
      : 0;

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: {
        text: text.trim(),
        sender: req.user._id,
        createdAt: new Date(),
      },
      [`unreadCount.${otherParticipant}`]: currentUnread + 1,
    });

    res.status(201).json({ success: true, data: populatedMessage });
  } catch (error) {
    console.error('sendMessage error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc  Get total unread messages count
// @route GET /api/messages/unread-count
// @access Private
exports.getUnreadCount = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
      isActive: true,
    });

    let totalUnread = 0;
    conversations.forEach((conv) => {
      const count = conv.unreadCount?.get
        ? (conv.unreadCount.get(req.user._id.toString()) || 0)
        : 0;
      totalUnread += count;
    });

    res.json({ success: true, count: totalUnread });
  } catch (error) {
    console.error('getUnreadCount error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc  Delete a conversation
// @route DELETE /api/messages/conversation/:conversationId
// @access Private
exports.deleteConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.conversationId,
      participants: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    conversation.isActive = false;
    await conversation.save();

    res.json({ success: true, message: 'Conversation deleted' });
  } catch (error) {
    console.error('deleteConversation error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};