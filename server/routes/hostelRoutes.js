const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

// ✅ Import controller - using the ACTUAL function names you have
const hostelController = require('../controllers/hostelController');

// ═══════════════════════════════════════════════════════════════
// PUBLIC ROUTES (NO AUTH REQUIRED)
// ═══════════════════════════════════════════════════════════════

// Get all hostels
router.get('/', hostelController.getHostels);

// Get nearby hostels
router.get('/nearby', hostelController.getNearbyHostels);

// Get single hostel by ID
router.get('/:id', hostelController.getHostel);

// Get hostel availability
router.get('/:id/availability', hostelController.getHostelAvailability);

// ═══════════════════════════════════════════════════════════════
// PROTECTED ROUTES (AUTH REQUIRED - OWNER/LANDLORD ONLY)
// ═══════════════════════════════════════════════════════════════

// Create new hostel
router.post('/', protect, authorize(['owner', 'landlord']), hostelController.createHostel);

// Update hostel
router.put('/:id', protect, authorize(['owner', 'landlord']), hostelController.updateHostel);

// Delete hostel
router.delete('/:id', protect, authorize(['owner', 'landlord']), hostelController.deleteHostel);

// Get user's hostels
router.get('/my-hostels/all', protect, authorize(['owner', 'landlord']), hostelController.getMyHostels);

module.exports = router;