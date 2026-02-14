const Hostel = require('../models/Hostel');

// @desc    Get all hostels with filters
// @route   GET /api/hostels
// @access  Public
exports.getHostels = async (req, res) => {
  try {
    const {
      search,
      type,
      minPrice,
      maxPrice,
      gender,
      amenities,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    // Build query
    let query = { isActive: true };

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    // Type filter
    if (type) {
      query.type = type;
    }

    // Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Gender filter
    if (gender && gender !== 'mixed') {
      query.$or = [
        { gender: gender },
        { gender: 'mixed' }
      ];
    } else if (gender === 'mixed') {
      query.gender = 'mixed';
    }

    // Amenities filter
    if (amenities) {
      const amenitiesArray = amenities.split(',');
      query.amenities = { $all: amenitiesArray };
    }

    // Sorting
    let sortOption = {};
    if (sort) {
      switch (sort) {
        case 'price_low':
          sortOption = { price: 1 };
          break;
        case 'price_high':
          sortOption = { price: -1 };
          break;
        case 'rating':
          sortOption = { averageRating: -1 };
          break;
        case 'latest':
        default:
          sortOption = { createdAt: -1 };
      }
    } else {
      sortOption = { createdAt: -1 };
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Execute query
    const hostels = await Hostel.find(query)
      .populate('owner', 'firstName lastName email phone verified')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination
    const total = await Hostel.countDocuments(query);

    res.json({
      success: true,
      hostels,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get single hostel by ID
// @route   GET /api/hostels/:id
// @access  Public
exports.getHostelById = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id)
      .populate('owner', 'firstName lastName email phone verified verificationStatus');

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }

    // Increment view count
    hostel.viewCount += 1;
    await hostel.save();

    res.json({
      success: true,
      hostel
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Create new hostel
// @route   POST /api/hostels
// @access  Private (Owner only)
exports.createHostel = async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      price,
      address,
      location,
      totalRooms,
      availableRooms,
      amenities,
      gender,
      contactPhone,
      images
    } = req.body;

    // Create hostel
    const hostel = await Hostel.create({
      name,
      description,
      type,
      price,
      address,
      location: {
        type: 'Point',
        coordinates: [location.lng, location.lat], // [longitude, latitude]
        formattedAddress: address
      },
      totalRooms,
      availableRooms,
      amenities,
      gender,
      contactPhone,
      images: images || [],
      owner: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Hostel created successfully',
      hostel
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update hostel
// @route   PUT /api/hostels/:id
// @access  Private (Owner only)
exports.updateHostel = async (req, res) => {
  try {
    let hostel = await Hostel.findById(req.params.id);

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }

    // Check if user is hostel owner
    if (hostel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this hostel'
      });
    }

    // Update location if provided
    if (req.body.location) {
      req.body.location = {
        type: 'Point',
        coordinates: [req.body.location.lng, req.body.location.lat],
        formattedAddress: req.body.address
      };
    }

    hostel = await Hostel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Hostel updated successfully',
      hostel
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Delete hostel
// @route   DELETE /api/hostels/:id
// @access  Private (Owner only)
exports.deleteHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }

    // Check if user is hostel owner
    if (hostel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this hostel'
      });
    }

    await hostel.deleteOne();

    res.json({
      success: true,
      message: 'Hostel deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get owner's hostels
// @route   GET /api/hostels/owner/my-hostels
// @access  Private (Owner only)
exports.getOwnerHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find({ owner: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      hostels
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get nearby hostels
// @route   GET /api/hostels/nearby
// @access  Public
exports.getNearbyHostels = async (req, res) => {
  try {
    const { lat, lng, radius = 5 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Please provide latitude and longitude'
      });
    }

    const hostels = await Hostel.find({
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(lng), Number(lat)]
          },
          $maxDistance: Number(radius) * 1000 // Convert km to meters
        }
      }
    })
    .populate('owner', 'firstName lastName')
    .limit(20);

    res.json({
      success: true,
      hostels
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};