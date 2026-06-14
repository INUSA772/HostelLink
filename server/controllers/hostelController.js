const Property = require('../models/Hostel'); // points to Hostel.js which now has the updated schema
const Booking = require('../models/Booking');

// @desc  Get all properties with filters
// @route GET /api/hostels
// @access Public
exports.getHostels = async (req, res) => {
  try {
    const {
      search, propertyType, gender, minPrice, maxPrice,
      amenities, sort = 'latest', page = 1, limit = 12,
    } = req.query;

    const query = { isActive: true };

    if (search) {
      query.$or = [
        { name:        { $regex: search, $options: 'i' } },
        { address:     { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (propertyType) query.propertyType = propertyType;
    if (gender)       query.gender = gender;
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
      oldest:     { createdAt:  1 },
      price_asc:  { price:  1 },
      price_desc: { price: -1 },
      price_low:  { price:  1 },
      price_high: { price: -1 },
      rating:     { averageRating: -1 },
    };

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('owner', 'firstName lastName email phone profilePicture verified')
      .sort(sortOptions[sort] || sortOptions.latest)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      count: properties.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      hostels: properties,
      data:    properties,
    });
  } catch (error) {
    console.error('getProperties error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching properties' });
  }
};

// @desc  Get single property by ID
// @route GET /api/hostels/:id
// @access Public
exports.getHostel = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'firstName lastName email phone profilePicture createdAt verified verificationStatus');

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    property.viewCount = (property.viewCount || 0) + 1;
    await property.save();

    res.json({ success: true, data: property, hostel: property });
  } catch (error) {
    console.error('getProperty error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching property' });
  }
};

// @desc  Create property
// @route POST /api/hostels
// @access Private (owner/admin)
exports.createHostel = async (req, res) => {
  try {
    req.body.owner = req.user._id;

    // Always build a valid location object
    req.body.location = {
      type: 'Point',
      coordinates: [0, 0],
      formattedAddress: req.body.location?.formattedAddress || req.body.address || '',
    };

    // Ensure gender is never undefined
    if (!req.body.gender) req.body.gender = '';

    console.log('📦 Creating property payload:', JSON.stringify(req.body, null, 2));

    const property = await Property.create(req.body);
    res.status(201).json({ success: true, message: 'Property listed successfully', data: property });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      console.error('❌ Validation errors:', messages);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    console.error('createHostel error:', error);
    res.status(500).json({ success: false, message: 'Server error creating property' });
  }
};

// @desc  Update property
// @route PUT /api/hostels/:id
// @access Private (owner/admin)
exports.updateHostel = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (
      property.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this property' });
    }

    if (req.body.location && req.body.location.lat !== undefined) {
      req.body.location = {
        type: 'Point',
        coordinates: [Number(req.body.location.lng), Number(req.body.location.lat)],
        formattedAddress: req.body.address || property.address,
      };
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, message: 'Property updated successfully', data: property });
  } catch (error) {
    console.error('updateProperty error:', error);
    res.status(500).json({ success: false, message: 'Server error updating property' });
  }
};

// @desc  Delete property (soft delete)
// @route DELETE /api/hostels/:id
// @access Private (owner/admin)
exports.deleteHostel = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (
      property.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this property' });
    }

    property.isActive = false;
    await property.save();

    res.json({ success: true, message: 'Property removed successfully' });
  } catch (error) {
    console.error('deleteProperty error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting property' });
  }
};

// @desc  Get properties owned by the logged-in landlord
// @route GET /api/hostels/my-hostels
// @access Private (owner/admin)
exports.getMyHostels = async (req, res) => {
  try {
    const properties = await Property.find({
      owner: req.user._id,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.json({ success: true, count: properties.length, data: properties, hostels: properties });
  } catch (error) {
    console.error('getMyProperties error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching your properties' });
  }
};

// @desc  Get property availability stats
// @route GET /api/hostels/:id/availability
// @access Public
exports.getHostelAvailability = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .select('totalRooms availableRooms name');

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const occupiedRooms = property.totalRooms - property.availableRooms;
    const occupancyRate = property.totalRooms > 0
      ? Math.round((occupiedRooms / property.totalRooms) * 100)
      : 0;

    res.json({
      success: true,
      data: {
        propertyName:   property.name,
        totalRooms:     property.totalRooms,
        availableRooms: property.availableRooms,
        occupiedRooms,
        occupancyRate,
      },
    });
  } catch (error) {
    console.error('getPropertyAvailability error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching availability' });
  }
};

// @desc  Get nearby properties
// @route GET /api/hostels/nearby
// @access Public
exports.getNearbyHostels = async (req, res) => {
  try {
    const { lat, lng, radius = 5 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'Please provide latitude and longitude' });
    }

    const properties = await Property.find({
      isActive: true,
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
          $maxDistance: Number(radius) * 1000,
        },
      },
    })
      .populate('owner', 'firstName lastName')
      .limit(20);

    res.json({ success: true, count: properties.length, data: properties });
  } catch (error) {
    console.error('getNearbyProperties error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching nearby properties' });
  }
};
// @desc  Track WhatsApp/Call clicks
// @route POST /api/hostels/:id/track-click
// @access Public
exports.trackClick = async (req, res) => {
  try {
    const { type } = req.body;
    const update = {};
    if (type === 'whatsapp') update.whatsappClicks = 1;
    if (type === 'call')     update.callClicks = 1;

    await Property.findByIdAndUpdate(req.params.id, { $inc: update });
    res.json({ success: true });
  } catch (error) {
    console.error('trackClick error:', error);
    res.status(500).json({ success: false });
  }
};