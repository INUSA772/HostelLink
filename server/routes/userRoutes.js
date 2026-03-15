const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const {
  getProfile,
  updateProfile,
  uploadAvatar,
  changePassword,
  getStudentDashboard,
  getLandlordDashboard,
  getAllUsers,
  deleteAccount,
} = require('../controllers/userController');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/profile/avatar', protect, upload.single('profilePicture'), uploadAvatar);
router.put('/change-password', protect, changePassword);
router.delete('/account', protect, deleteAccount);

router.get('/dashboard/student', protect, authorize('student'), getStudentDashboard);
router.get('/dashboard/landlord', protect, authorize('landlord'), getLandlordDashboard);

router.get('/', protect, authorize('admin'), getAllUsers);

module.exports = router;