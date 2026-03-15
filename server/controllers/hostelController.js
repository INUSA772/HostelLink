const Hostel = require('../models/Hostel');
const Booking = require('../models/Booking');

// @desc  Get all hostels with filters
// @route GET /api/hostels
// @access Public
exports.getHostels = async (req, res) => {
  try {
    const {
      search, type, gender, minPrice, maxPrice,
      amenities, sort = 'latest', page = 1, limit = 12,
    } = req.query;

    const query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (type) query.type = type;
    if (gender) query.gender = gender;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (amenities) {
      const amenityList = amenities.split(',').map((a) => a.trim());
      query.amenities = { $all: amenityList };
    }

    const sortOptions = {
      latest:     { createdAt: -1 },
      oldest:     { createdAt: 1 },
      price_asc:  { price: 1 },
      price_desc: { price: -1 },
      price_low:  { price: 1 },
      price_high: { price: -1 },
      rating:     { averageRating: -1 },
    };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Hostel.countDocuments(query);
    const hostels = await Hostel.find(query)
      .populate('owner', 'firstName lastName email phone profilePicture verified')
      .sort(sortOptions[sort] || sortOptions.latest)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      count: hostels.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      hostels,
      data: hostels,
    });
  } catch (error) {
    console.error('getHostels error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching hostels' });
  }
};

// @desc  Get single hostel by ID
// @route GET /api/hostels/:id
// @access Public
exports.getHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id)
      .populate('owner', 'firstName lastName email phone profilePicture createdAt verified verificationStatus');

    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }

    hostel.viewCount = (hostel.viewCount || 0) + 1;
    await hostel.save();

    res.json({ success: true, data: hostel, hostel });
  } catch (error) {
    console.error('getHostel error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching hostel' });
  }
};

// @desc  Create hostel
// @route POST /api/hostels
// @access Private (owner/admin)
exports.createHostel = async (req, res) => {
  try {
    req.body.owner = req.user._id;

    if (req.body.location && req.body.location.lat !== undefined) {
      req.body.location = {
        type: 'Point',
        coordinates: [req.body.location.lng, req.body.location.lat],
        formattedAddress: req.body.address,
      };
    }

    const hostel = await Hostel.create(req.body);
    res.status(201).json({ success: true, message: 'Hostel created successfully', data: hostel });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    console.error('createHostel error:', error);
    res.status(500).json({ success: false, message: 'Server error creating hostel' });
  }
};

// @desc  Update hostel
// @route PUT /api/hostels/:id
// @access Private (owner/admin)
exports.updateHostel = async (req, res) => {
  try {
    let hostel = await Hostel.findById(req.params.id);

    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }

    if (
      hostel.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this hostel' });
    }

    if (req.body.location && req.body.location.lat !== undefined) {
      req.body.location = {
        type: 'Point',
        coordinates: [req.body.location.lng, req.body.location.lat],
        formattedAddress: req.body.address || hostel.address,
      };
    }

    hostel = await Hostel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, message: 'Hostel updated successfully', data: hostel });
  } catch (error) {
    console.error('updateHostel error:', error);
    res.status(500).json({ success: false, message: 'Server error updating hostel' });
  }
};

// @desc  Delete hostel (soft delete)
// @route DELETE /api/hostels/:id
// @access Private (owner/admin)
exports.deleteHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);

    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }

    if (
      hostel.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this hostel' });
    }

    // ✅ Soft delete — keeps records for existing bookings
    hostel.isActive = false;
    await hostel.save();

    res.json({ success: true, message: 'Hostel removed successfully' });
  } catch (error) {
    console.error('deleteHostel error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting hostel' });
  }
};

// @desc  Get hostels owned by the logged-in landlord
// @route GET /api/hostels/my-hostels
// @access Private (owner/admin)
exports.getMyHostels = async (req, res) => {
  try {
    // ✅ FIXED: only return active hostels so deleted ones never reappear
    const hostels = await Hostel.find({
      owner: req.user._id,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.json({ success: true, count: hostels.length, data: hostels, hostels });
  } catch (error) {
    console.error('getMyHostels error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching your hostels' });
  }
};

// @desc  Get hostel availability/occupancy stats
// @route GET /api/hostels/:id/availability
// @access Public
exports.getHostelAvailability = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id)
      .select('totalRooms availableRooms name');

    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }

    const occupiedRooms = hostel.totalRooms - hostel.availableRooms;
    const occupancyRate = hostel.totalRooms > 0
      ? Math.round((occupiedRooms / hostel.totalRooms) * 100)
      : 0;

    res.json({
      success: true,
      data: {
        hostelName: hostel.name,
        totalRooms: hostel.totalRooms,
        availableRooms: hostel.availableRooms,
        occupiedRooms,
        occupancyRate,
      },
    });
  } catch (error) {
    console.error('getHostelAvailability error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching availability' });
  }
};

// @desc  Get nearby hostels
// @route GET /api/hostels/nearby
// @access Public
exports.getNearbyHostels = async (req, res) => {
  try {
    const { lat, lng, radius = 5 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'Please provide latitude and longitude' });
    }

    const hostels = await Hostel.find({
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(lng), Number(lat)],
          },
          $maxDistance: Number(radius) * 1000,
        },
      },
    })
      .populate('owner', 'firstName lastName')
      .limit(20);

    res.json({ success: true, count: hostels.length, data: hostels });
  } catch (error) {
    console.error('getNearbyHostels error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching nearby hostels' });
  }
};