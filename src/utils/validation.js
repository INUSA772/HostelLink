import * as Yup from 'yup';
import { VALIDATION_MESSAGES } from './constants';

// Email validation
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// Phone validation - Accept any format
export const validatePhone = (phone) => {
  // Just check if it's not empty
  return phone && phone.trim().length > 0;
};

// Password strength validation
export const validatePasswordStrength = (password) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*]/.test(password)
  };
  
  const strength = Object.values(checks).filter(Boolean).length;
  
  return {
    isValid: checks.length && strength >= 3,
    strength: strength,
    checks: checks
  };
};

// File validation
export const validateImageFile = (file, maxSize = 5 * 1024 * 1024) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }
  
  if (!validTypes.includes(file.type)) {
    return { isValid: false, error: 'Invalid file type. Only JPG, PNG, and WEBP are allowed' };
  }
  
  if (file.size > maxSize) {
    return { isValid: false, error: `File size must be less than ${maxSize / (1024 * 1024)}MB` };
  }
  
  return { isValid: true, error: null };
};

// Yup Validation Schemas

// Login Schema
export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email(VALIDATION_MESSAGES.EMAIL)
    .required(VALIDATION_MESSAGES.REQUIRED),
  password: Yup.string()
    .min(8, VALIDATION_MESSAGES.PASSWORD_MIN)
    .required(VALIDATION_MESSAGES.REQUIRED)
});

// Registration Schema
export const registerSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .required(VALIDATION_MESSAGES.REQUIRED),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .required(VALIDATION_MESSAGES.REQUIRED),
  email: Yup.string()
    .email(VALIDATION_MESSAGES.EMAIL)
    .required(VALIDATION_MESSAGES.REQUIRED),
  phone: Yup.string()
    .test('phone', VALIDATION_MESSAGES.PHONE, validatePhone)
    .required(VALIDATION_MESSAGES.REQUIRED),
  password: Yup.string()
    .min(8, VALIDATION_MESSAGES.PASSWORD_MIN)
    .required(VALIDATION_MESSAGES.REQUIRED),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], VALIDATION_MESSAGES.PASSWORD_MATCH)
    .required(VALIDATION_MESSAGES.REQUIRED),
  role: Yup.string()
    .oneOf(['student', 'owner'])
    .required(VALIDATION_MESSAGES.REQUIRED),
  studentId: Yup.string().when('role', {
    is: 'student',
    then: () => Yup.string().required('Student ID is required for students')
  })
});

// Hostel Schema
export const hostelSchema = Yup.object().shape({
  name: Yup.string()
    .min(5, 'Hostel name must be at least 5 characters')
    .required(VALIDATION_MESSAGES.REQUIRED),
  description: Yup.string()
    .min(20, 'Description must be at least 20 characters')
    .required(VALIDATION_MESSAGES.REQUIRED),
  type: Yup.string()
    .required(VALIDATION_MESSAGES.REQUIRED),
  price: Yup.number()
    .positive(VALIDATION_MESSAGES.PRICE_MIN)
    .required(VALIDATION_MESSAGES.REQUIRED),
  address: Yup.string()
    .required(VALIDATION_MESSAGES.REQUIRED),
  location: Yup.object().shape({
    lat: Yup.number().required(),
    lng: Yup.number().required()
  }),
  totalRooms: Yup.number()
    .positive('Total rooms must be greater than 0')
    .integer('Total rooms must be a whole number')
    .required(VALIDATION_MESSAGES.REQUIRED),
  availableRooms: Yup.number()
    .positive('Available rooms must be greater than 0')
    .integer('Available rooms must be a whole number')
    .max(Yup.ref('totalRooms'), 'Available rooms cannot exceed total rooms')
    .required(VALIDATION_MESSAGES.REQUIRED),
  amenities: Yup.array()
    .min(1, 'Select at least one amenity'),
  gender: Yup.string()
    .oneOf(['male', 'female', 'mixed'])
    .required(VALIDATION_MESSAGES.REQUIRED),
  contactPhone: Yup.string()
    .test('phone', VALIDATION_MESSAGES.PHONE, validatePhone)
    .required(VALIDATION_MESSAGES.REQUIRED)
});

// Review Schema
export const reviewSchema = Yup.object().shape({
  rating: Yup.number()
    .min(1, 'Please provide a rating')
    .max(5, 'Rating cannot exceed 5')
    .required(VALIDATION_MESSAGES.REQUIRED),
  cleanliness: Yup.number().min(1).max(5),
  safety: Yup.number().min(1).max(5),
  valueForMoney: Yup.number().min(1).max(5),
  landlordResponsiveness: Yup.number().min(1).max(5),
  comment: Yup.string()
    .min(10, 'Review must be at least 10 characters')
    .max(500, 'Review cannot exceed 500 characters')
});

// Booking Schema
export const bookingSchema = Yup.object().shape({
  moveInDate: Yup.date()
    .min(new Date(), 'Move-in date cannot be in the past')
    .required(VALIDATION_MESSAGES.REQUIRED),
  duration: Yup.number()
    .positive('Duration must be at least 1 month')
    .integer('Duration must be a whole number')
    .required(VALIDATION_MESSAGES.REQUIRED),
  numberOfOccupants: Yup.number()
    .positive('Number of occupants must be at least 1')
    .integer('Must be a whole number')
    .required(VALIDATION_MESSAGES.REQUIRED)
});

// Contact Form Schema
export const contactSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required(VALIDATION_MESSAGES.REQUIRED),
  email: Yup.string()
    .email(VALIDATION_MESSAGES.EMAIL)
    .required(VALIDATION_MESSAGES.REQUIRED),
  subject: Yup.string()
    .min(5, 'Subject must be at least 5 characters')
    .required(VALIDATION_MESSAGES.REQUIRED),
  message: Yup.string()
    .min(20, 'Message must be at least 20 characters')
    .required(VALIDATION_MESSAGES.REQUIRED)
});