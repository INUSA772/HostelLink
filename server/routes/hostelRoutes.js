const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const hostelController = require('../controllers/hostelController');

// ═══════════════════════════════════════════════════════════════
// PUBLIC ROUTES (NO AUTH REQUIRED)
// ═══════════════════════════════════════════════════════════════

// Get all hostels
router.get('/', hostelController.getHostels);

// Get nearby hostels
router.get('/nearby', hostelController.getNearbyHostels);

// ✅ FIXED: /my-hostels MUST be before /:id
// otherwise Express reads "my-hostels" as an :id param
router.get(
  '/my-hostels',
  protect,
  authorize('owner', 'landlord', 'admin'),
  hostelController.getMyHostels
);

// Get hostel availability — also before /:id
router.get('/:id/availability', hostelController.getHostelAvailability);

// Get single hostel by ID — keep this LAST among GET routes
router.get('/:id', hostelController.getHostel);

// ═══════════════════════════════════════════════════════════════
// PROTECTED ROUTES (AUTH REQUIRED)
// ═══════════════════════════════════════════════════════════════

// Create new hostel
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