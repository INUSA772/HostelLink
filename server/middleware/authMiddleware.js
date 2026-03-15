const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ── PROTECT ───────────────────────────────────────
// Verifies JWT and attaches req.user
exports.protect = async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - No token provided',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      console.error('[AUTH] JWT verification failed:', jwtError.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized - Invalid or expired token',
      });
    }

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - User not found',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - Account is deactivated',
      });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error('[AUTH ERROR]', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
    });
  }
};

// ── AUTHORIZE ─────────────────────────────────────
// Usage: authorize('student', 'owner') or authorize(['student', 'owner'])
exports.authorize = (...roles) => {
  const allowedRoles = roles.flat();

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, please login',
      });
    }

    console.log(`🔐 Role check → user role: "${req.user.role}" | allowed: [${allowedRoles}]`);

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access forbidden: role "${req.user.role}" is not allowed`,
      });
    }

    next();
  };
};

// ── IS OWNER ──────────────────────────────────────
exports.isOwner = (resourceField = 'owner') => {
  return (req, res, next) => {
    try {
      const resourceOwnerId = req.params.id || req.body[resourceField];

      if (req.user._id.toString() !== resourceOwnerId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized - You are not the owner of this resource',
        });
      }

      next();
    } catch (error) {
      console.error('[AUTH ERROR]', error);
      return res.status(500).json({
        success: false,
        message: 'Authorization error',
      });
    }
  };
};

// ── ADMIN ONLY ────────────────────────────────────
exports.admin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access only',
    });
  }
  next();
};

// ── REQUIRE VERIFIED ──────────────────────────────
exports.requireVerified = (req, res, next) => {
  if (!req.user.verified) {
    return res.status(403).json({
      success: false,
      message: 'Account verification required',
    });
  }
  next();
};