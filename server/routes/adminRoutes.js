const express = require('express');
const router  = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getAdminStats,
  getUsers,
  verifyUser,
  updateUser,
  deleteUser,
  deleteHostel,
  flagHostel,
  trackWhatsappClick,
  getSettings,
  updateSettings,
} = require('../controllers/adminController');

const admin = [protect, authorize('admin')];

router.get('/stats',                       ...admin, getAdminStats);
router.get('/users',                       ...admin, getUsers);
router.patch('/users/:id/verify',          ...admin, verifyUser);
router.patch('/users/:id',                 ...admin, updateUser);
router.delete('/users/:id',                ...admin, deleteUser);
router.delete('/hostels/:id',              ...admin, deleteHostel);
router.patch('/hostels/:id/flag',          ...admin, flagHostel);
// Public — fired from anonymous browsing, it's just a click counter
router.post('/properties/:id/whatsapp-click', trackWhatsappClick);
router.get('/settings',                    ...admin, getSettings);
router.patch('/settings',                  ...admin, updateSettings);

module.exports = router;