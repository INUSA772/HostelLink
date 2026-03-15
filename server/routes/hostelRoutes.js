// server/routes/hostelRoutes.js
const express = require('express');
const router = express.Router();
const hostelController = require('../controllers/hostelController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// ✅ PUBLIC ROUTES (NO AUTH REQUIRED)

// Get all hostels with filters
router.get('/', hostelController.getAllHostels);

// Get hostel by ID
router.get('/:id', hostelController.getHostelById);

// Search hostels
router.get('/search/query', hostelController.searchHostels);

// Get hostels by location
router.get('/location/:location', hostelController.getHostelsByLocation);

// ✅ PROTECTED ROUTES (AUTH REQUIRED)

// Create new hostel (owner only)
router.post(
  '/',
  authenticate,
  authorize(['owner']),
  upload.array('images', 10),
  hostelController.createHostel
);

// Update hostel (owner only)
router.put(
  '/:id',
  authenticate,
  authorize(['owner']),
  upload.array('images', 10),
  hostelController.updateHostel
);

// Delete hostel (owner only)
router.delete(
  '/:id',
  authenticate,
  authorize(['owner']),
  hostelController.deleteHostel
);

// Get my hostels (owner only)
router.get(
  '/my-hostels/all',
  authenticate,
  authorize(['owner']),
  hostelController.getMyHostels
);

// Get hostel statistics (owner only)
router.get(
  '/:id/stats',
  authenticate,
  authorize(['owner']),
  hostelController.getHostelStats
);

// Add amenity to hostel
router.post(
  '/:id/amenities',
  authenticate,
  authorize(['owner']),
  hostelController.addAmenity
);S

// Remove amenity from hostel
router.delete(
  '/:id/amenities/:amenity',
  authenticate,
  authorize(['owner']),
  hostelController.removeAmenity
);

module.exports = router;