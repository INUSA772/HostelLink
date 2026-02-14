const express = require('express');
const router = express.Router();
const {
  getHostels,
  getHostelById,
  createHostel,
  updateHostel,
  deleteHostel,
  getOwnerHostels,
  getNearbyHostels
} = require('../controllers/hostelController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getHostels);
router.get('/nearby', getNearbyHostels);
router.get('/:id', getHostelById);

// Protected routes - Owner only
router.post('/', protect, authorize('owner'), createHostel);
router.put('/:id', protect, authorize('owner'), updateHostel);
router.delete('/:id', protect, authorize('owner'), deleteHostel);
router.get('/owner/my-hostels', protect, authorize('owner'), getOwnerHostels);

module.exports = router;