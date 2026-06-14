const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
  unitNumber: {
    type: String,
    required: [true, 'Unit number is required'],
    trim: true
  },
  totalSpaces: {
    type: Number,
    required: [true, 'Total spaces is required'],
    min: [1, 'Must have at least 1 space']
  },
  availableSpaces: {
    type: Number,
    required: [true, 'Available spaces is required'],
    min: [0, 'Available spaces cannot be negative']
  },
  price:       { type: Number, default: 0 },
  images:      [{ type: String }],
  description: { type: String, trim: true },
  isAvailable: { type: Boolean, default: true }
});

const hostelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a property name'],
    trim: true,
    minlength: [5, 'Property name must be at least 5 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    minlength: [20, 'Description must be at least 20 characters']
  },
  propertyType: {
    type: String,
    required: [true, 'Please add a property type'],
    enum: [
      'House', 'Flat/Apartment', 'Single Room', 'Self-Contained',
      'Plot of Land', 'Commercial Space', 'Office Space', 'Warehouse',
    ]
  },
  listingType: {
    type: String,
    enum: ['For Rent', 'For Sale'],
    default: 'For Rent'
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative']
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  district: {
    type: String,
    default: ''
  },
  location: {
    type:        { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },   // never required — defaults to [0,0]
    formattedAddress: String
  },
  bedrooms:  { type: Number, default: 0, min: 0 },
  bathrooms: { type: Number, default: 0, min: 0 },
  totalRooms: {
    type: Number,
    default: 0,
    min: [0, 'Total units cannot be negative']
  },
  availableRooms: {
    type: Number,
    default: 0,
    min: [0, 'Available units cannot be negative'],
    validate: {
      validator: function (value) { return value <= this.totalRooms; },
      message: 'Available units cannot exceed total units'
    }
  },
  units: [unitSchema],
  amenities: [{
    type: String,
    enum: [
      'Water 24/7', 'WiFi', 'Electricity (ESCOM)', 'Solar Power',
      'CCTV Security', 'Security Guard', 'Parking', 'Garden',
      'Borehole Water', 'Flush Toilet', 'Bathroom', 'Kitchen',
      'Living Room', 'Dining Room', 'Store Room', 'Servant Quarters',
      'Fence/Wall', 'Gate', 'Tiled Floors', 'Ceiling',
    ]
  }],
  gender: {
    type: String,
    enum: ['male', 'female', 'family', 'mixed', ''],
    default: ''
  },
  contactPhone: {
    type: String,
    required: [true, 'Please add a contact phone number']
  },
  whatsapp: { type: String, default: '' },
  images:   [{ type: String }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
verified:      { type: Boolean, default: false },
  featured:      { type: Boolean, default: false },
  isActive:      { type: Boolean, default: true },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount:   { type: Number, default: 0 },
  viewCount:     { type: Number, default: 0 },
  whatsappClicks: { type: Number, default: 0 },
  callClicks:     { type: Number, default: 0 }
}, { timestamps: true });

hostelSchema.index({ location: '2dsphere' });
hostelSchema.index({ name: 'text', description: 'text', address: 'text' });

module.exports = mongoose.model('Hostel', hostelSchema);