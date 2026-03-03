const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getProfile,
  updateProfile,
  changePassword,
  getStudentDashboard,
  getLandlordDashboard,
  getAllUsers,
  deleteAccount,
} = require('../controllers/userController');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.delete('/account', protect, deleteAccount);

router.get('/dashboard/student', protect, authorize('student'), getStudentDashboard);
router.get('/dashboard/landlord', protect, authorize('landlord'), getLandlordDashboard);

// Admin only
router.get('/', protect, authorize('admin'), getAllUsers);

module.exports = router;