// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * ✅ Protect routes - Verify JWT token and authenticate user
 * Adds req.user with user data to request
 */
exports.protect = async (req, res, next) => {
  let token;

<<<<<<< HEAD
  try {
    // ✅ 1. Get token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
=======
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
>>>>>>> b58c1592af02064fbd8848ccc82e179f0aa458a4
      token = req.headers.authorization.split(' ')[1];
    }

<<<<<<< HEAD
    // ✅ 2. Check if token exists
    if (!token) {
=======
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      next();
    } catch (error) {
      console.error('Token error:', error.message);
>>>>>>> b58c1592af02064fbd8848ccc82e179f0aa458a4
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route - No token provided'
      });
    }

    // ✅ 3. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      console.error('[AUTH ERROR] JWT verification failed:', jwtError.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized - Invalid or expired token'
      });
    }

    // ✅ 4. Get user from database
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - User not found'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - User account is deactivated'
      });
    }

    // ✅ 5. Attach user to request
    req.user = user;
    next();

  } catch (error) {
    console.error('[AUTH ERROR]', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

<<<<<<< HEAD
/**
 * ✅ Authorize - Check user role
 * Usage: router.post('/', protect, authorize('student', 'owner'), controller)
 * Or: router.post('/', protect, authorize(['student', 'owner']), controller)
 */
=======
// ✅ FIXED: handles both authorize('owner') and authorize(['owner', 'landlord'])
>>>>>>> b58c1592af02064fbd8848ccc82e179f0aa458a4
exports.authorize = (...roles) => {
  const allowedRoles = roles.flat();

  return (req, res, next) => {
<<<<<<< HEAD
    try {
      // ✅ Handle both authorize('student', 'owner') and authorize(['student', 'owner'])
      let allowedRoles = roles;
      
      if (roles.length === 1 && Array.isArray(roles[0])) {
        allowedRoles = roles[0];
      }

      // ✅ Check if user role is in allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        console.warn(`[AUTH] Unauthorized role access: ${req.user.role} tried to access route requiring ${allowedRoles.join(', ')}`);
        
        return res.status(403).json({
          success: false,
          message: `User role '${req.user.role}' is not authorized to access this route. Required roles: ${allowedRoles.join(', ')}`
        });
      }

      next();

    } catch (error) {
      console.error('[AUTH ERROR]', error);
      return res.status(500).json({
        success: false,
        message: 'Authorization error'
      });
    }
=======
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, please login'
      });
    }

    console.log(`🔐 Role check → user role: "${req.user.role}" | allowed: [${allowedRoles}]`);

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access forbidden: your role "${req.user.role}" is not allowed to perform this action`
      });
    }

    next();
>>>>>>> b58c1592af02064fbd8848ccc82e179f0aa458a4
  };
};

/**
 * ✅ Optional: Check if user is owner of resource
 * Usage: router.put('/:id', protect, isOwner, controller)
 */
exports.isOwner = (resourceField = 'owner') => {
  return (req, res, next) => {
    try {
      const resourceOwnerId = req.params.id || req.body[resourceField];
      
      if (req.user._id.toString() !== resourceOwnerId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized - You are not the owner of this resource'
        });
      }

      next();

    } catch (error) {
      console.error('[AUTH ERROR]', error);
      return res.status(500).json({
        success: false,
        message: 'Authorization error'
      });
    }
  };
};

/**
 * ✅ Optional: Check if user is admin
 */
exports.admin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access only'
    });
  }
  next();
};

/**
 * ✅ Optional: Verify user account is verified
 */
exports.requireVerified = (req, res, next) => {
  if (!req.user.verified) {
    return res.status(403).json({
      success: false,
      message: 'Account verification required'
    });
  }
  next();
};