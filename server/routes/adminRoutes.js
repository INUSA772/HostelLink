const express = require('express');
const router  = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getAdminStats } = require('../controllers/adminController');

router.get('/stats', protect, authorize('admin'), getAdminStats);

module.exports = router;