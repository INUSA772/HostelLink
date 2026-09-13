const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAll,
} = require('../controllers/notificationController');

router.use(protect);

// ✅ specific routes BEFORE /:id
router.get('/unread-count', getUnreadCount);
router.get('/', getNotifications);
router.put('/read-all', markAllAsRead);
router.delete('/delete-all', deleteAll);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;