const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getProfile,
  updateProfile,
  updateAvatar,
  changePassword,
  getStudentDashboard,
  getLandlordDashboard,
  getAllUsers,
  deleteAccount,
} = require('../controllers/userController');

// ── MULTER — memory storage ───────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// ── ROUTES ────────────────────────────────────────
router.get('/profile',         protect, getProfile);
router.put('/profile',         protect, updateProfile);
router.put('/profile/avatar',  protect, upload.single('profilePicture'), updateAvatar);
router.put('/change-password', protect, changePassword);
router.delete('/account',      protect, deleteAccount);

router.get('/dashboard/student',  protect, authorize('student'),          getStudentDashboard);
router.get('/dashboard/landlord', protect, authorize('owner', 'landlord'), getLandlordDashboard);

// Admin only
router.get('/', protect, authorize('admin'), getAllUsers);

module.exports = router;