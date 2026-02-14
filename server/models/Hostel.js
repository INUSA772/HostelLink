const mongoose = require('mongoose');

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
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    },
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
      validator: function(value) {
        return value <= this.totalRooms;
      },
      message: 'Available rooms cannot exceed total rooms'
    }
  },
  amenities: [{
    type: String,
    enum: [
      'WiFi',
      'Water 24/7',
      'Electricity Backup',
      'Security Guard',
      'CCTV',
      'Parking',
      'Kitchen',
      'Laundry',
      'Study Room',
      'Common Area',
      'Furniture Included',
      'Air Conditioning',
      'Hot Shower'
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
  images: [{
    type: String
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create geospatial index for location-based queries
hostelSchema.index({ location: '2dsphere' });

// Index for search
hostelSchema.index({ name: 'text', description: 'text', address: 'text' });

module.exports = mongoose.model('Hostel', hostelSchema);