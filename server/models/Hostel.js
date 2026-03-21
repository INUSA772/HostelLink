const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: [true, 'Room number is required'],
    trim: true
  },
  totalBedspaces: {
    type: Number,
    required: [true, 'Total bedspaces is required'],
    min: [1, 'Must have at least 1 bedspace']
  },
  availableBedspaces: {
    type: Number,
    required: [true, 'Available bedspaces is required'],
    min: [0, 'Available bedspaces cannot be negative']
  },
  price: {
    type: Number,
    default: 0
  },
  images: [{ type: String }],
  description: { type: String, trim: true },
  isAvailable: { type: Boolean, default: true }
});

const hostelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add hostel name'],
    trim: true,
    minlength: [5, 'Hostel name must be at least 5 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add description'],
    minlength: [20, 'Description must be at least 20 characters']
  },
  type: {
    type: String,
    required: [true, 'Please add hostel type'],
    enum: [
      'Single Room',
      'Shared Room (2 people)',
      'Shared Room (3+ people)',
      'Self-Contained',
      'Bedsitter',
      'One Bedroom',
      'Two Bedroom'
    ]
  },
  price: {
    type: Number,
    required: [true, 'Please add price'],
    min: [0, 'Price cannot be negative']
  },
  address: {
    type: String,
    required: [true, 'Please add address']
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
    formattedAddress: String
  },
  totalRooms: {
    type: Number,
    required: [true, 'Please add total number of rooms'],
    min: [1, 'Must have at least 1 room']
  },
  availableRooms: {
    type: Number,
    required: [true, 'Please add available rooms'],
    min: [0, 'Available rooms cannot be negative'],
    validate: {
      validator: function (value) { return value <= this.totalRooms; },
      message: 'Available rooms cannot exceed total rooms'
    }
  },
  // ── Individual rooms with bedspaces ──────────────────────────
  rooms: [roomSchema],
  amenities: [{
    type: String,
    enum: [
      'WiFi', 'Water 24/7', 'Electricity Backup', 'Security Guard',
      'CCTV', 'Parking', 'Kitchen', 'Laundry', 'Study Room',
      'Common Area', 'Furniture Included', 'Air Conditioning', 'Hot Shower'
    ]
  }],
  gender: {
    type: String,
    required: [true, 'Please specify gender'],
    enum: ['male', 'female', 'mixed']
  },
  contactPhone: {
    type: String,
    required: [true, 'Please add contact phone number']
  },
  images: [{ type: String }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  verified: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 }
}, { timestamps: true });

hostelSchema.index({ location: '2dsphere' });
hostelSchema.index({ name: 'text', description: 'text', address: 'text' });

module.exports = mongoose.model('Hostel', hostelSchema);