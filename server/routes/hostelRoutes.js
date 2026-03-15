const express = require('express');
const router  = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const hostelController = require('../controllers/hostelController');

// ── PUBLIC ROUTES ─────────────────────────────────

// Get all hostels
router.get('/', hostelController.getAllHostels);

// ✅ IMPORTANT: /my-hostels MUST be before /:id
// otherwise Express reads "my-hostels" as an :id param
router.get(
  '/my-hostels',
  protect,
  authorize('owner', 'landlord', 'admin'),
  hostelController.getMyHostels
);

// Get hostel availability
router.get('/:id/availability', hostelController.getHostelAvailability);

// Get single hostel by ID — keep LAST among GET routes
router.get('/:id', hostelController.getHostelById);

// ── PROTECTED ROUTES ──────────────────────────────

// Create hostel
router.post(
  '/',
  protect,
  authorize('owner', 'landlord', 'admin'),
  hostelController.createHostel
);

// Update hostel
router.put(
  '/:id',
  protect,
  authorize('owner', 'landlord', 'admin'),
  hostelController.updateHostel
);

// Delete hostel
router.delete(
  '/:id',
  protect,
  authorize('owner', 'landlord', 'admin'),
  hostelController.deleteHostel
);

module.exports = router;