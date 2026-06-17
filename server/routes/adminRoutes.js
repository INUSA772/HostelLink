const express      = require('express');
const router       = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const trackVisitor = require('../middleware/trackVisitor');
const {
  getAdminStats,
  getUsers,
  verifyUser,
  updateUser,
  deleteUser,
  deleteHostel,
  flagHostel,
  trackWhatsappClick,
} = require('../controllers/adminController');

const admin = [protect, authorize('admin')];

// ── public: called once when anyone opens the site ──
router.post('/track-visit', trackVisitor);

// ── protected admin routes ──
router.get('/stats',                       ...admin, getAdminStats);
router.get('/users',                       ...admin, getUsers);
router.patch('/users/:id/verify',          ...admin, verifyUser);
router.patch('/users/:id',                 ...admin, updateUser);
router.delete('/users/:id',                ...admin, deleteUser);
router.delete('/hostels/:id',              ...admin, deleteHostel);
router.patch('/hostels/:id/flag',          ...admin, flagHostel);
router.post('/hostels/:id/whatsapp-click', protect,  trackWhatsappClick);

module.exports = router;