// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// User Roles
export const USER_ROLES = {
  STUDENT: 'student',
  OWNER: 'owner',
  ADMIN: 'admin'
};

// Hostel Types
export const HOSTEL_TYPES = [
  'Single Room',
  'Shared Room (2 people)',
  'Shared Room (3+ people)',
  'Self-Contained',
  'Bedsitter',
  'One Bedroom',
  'Two Bedroom'
];

// Amenities
export const AMENITIES = [
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
];

// Distance from Campus
export const DISTANCE_OPTIONS = [
  { value: '0-1', label: 'Less than 1 km' },
  { value: '1-2', label: '1-2 km' },
  { value: '2-5', label: '2-5 km' },
  { value: '5+', label: 'More than 5 km' }
];

// Price Ranges (in MWK)
export const PRICE_RANGES = [
  { value: '0-30000', label: 'Below 30,000' },
  { value: '30000-50000', label: '30,000 - 50,000' },
  { value: '50000-80000', label: '50,000 - 80,000' },
  { value: '80000-120000', label: '80,000 - 120,000' },
  { value: '120000+', label: 'Above 120,000' }
];

// Payment Methods
export const PAYMENT_METHODS = [
  { value: 'airtel_money', label: 'Airtel Money', icon: '📱' },
  { value: 'tnm_mpamba', label: 'TNM Mpamba', icon: '📱' },
  { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' },
  { value: 'cash', label: 'Cash Payment', icon: '💵' }
];

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

// Verification Status
export const VERIFICATION_STATUS = {
  UNVERIFIED: 'unverified',
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected'
};

// Gender Options
export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male Only' },
  { value: 'female', label: 'Female Only' },
  { value: 'mixed', label: 'Mixed' }
];

// Sorting Options
export const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'distance', label: 'Nearest to Campus' }
];

// MUBAS Campus Coordinates
export const CAMPUS_LOCATION = {
  lat: -15.8020,
  lng: 35.0259,
  name: 'Malawi University of Business and Applied Sciences (MUBAS)'
};

// Pagination
export const ITEMS_PER_PAGE = 12;

// Image Upload
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_IMAGES = 10;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Form Validation
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL: 'Please enter a valid email address',
  PHONE: 'Please enter a valid phone number',
  PASSWORD_MIN: 'Password must be at least 8 characters',
  PASSWORD_MATCH: 'Passwords do not match',
  PRICE_MIN: 'Price must be greater than 0',
  NUMBER: 'Please enter a valid number'
};