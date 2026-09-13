const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getOrCreateConversation,
  getConversations,
  getMessages,
  sendMessage,
  getUnreadCount,
  deleteConversation,
} = require('../controllers/messageController');

router.use(protect);

router.get('/unread-count', getUnreadCount);
router.get('/conversations', getConversations);
router.post('/conversation', getOrCreateConversation);
router.delete('/conversation/:conversationId', deleteConversation);
router.get('/:conversationId', getMessages);
router.post('/:conversationId', sendMessage);

module.exports = router;