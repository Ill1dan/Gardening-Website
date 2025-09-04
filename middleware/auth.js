const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  // Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account has been deactivated'
        });
      }

      req.user = user;
      next();

    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}, your role: ${req.user.role}`
      });
    }

    next();
  };
};

// Check if user has minimum role level
const requireRole = (minimumRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const roleHierarchy = {
      viewer: 1,
      gardener: 2,
      admin: 3
    };

    const userLevel = roleHierarchy[req.user.role];
    const requiredLevel = roleHierarchy[minimumRole];

    if (userLevel < requiredLevel) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Minimum role required: ${minimumRole}, your role: ${req.user.role}`
      });
    }

    next();
  };
};

// Check if user owns the resource or is admin
const authorizeOwnerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated'
    });
  }

  // Allow if user is admin
  if (req.user.role === 'admin') {
    return next();
  }

  // Allow if user owns the resource (check user ID in params)
  if (req.params.id && req.params.id === req.user._id.toString()) {
    return next();
  }

  // Allow if user owns the resource (check userId in params)
  if (req.params.userId && req.params.userId === req.user._id.toString()) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Access denied. You can only access your own resources or need admin privileges'
  });
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  let token;

  // Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.userId).select('-password');

      if (user && user.isActive) {
        req.user = user;
      }
    } catch (error) {
      // Token is invalid, but we don't fail - just continue without user
      console.log('Optional auth - invalid token:', error.message);
    }
  }

  next();
};

// Rate limiting for sensitive operations
const sensitiveOperation = (req, res, next) => {
  // Add additional security checks for sensitive operations
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated'
    });
  }

  // Check if user has been active recently (within last hour)
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  if (req.user.lastLogin && req.user.lastLogin < oneHourAgo) {
    return res.status(401).json({
      success: false,
      message: 'Session expired. Please login again for sensitive operations'
    });
  }

  next();
};

module.exports = {
  protect,
  authorize,
  requireRole,
  authorizeOwnerOrAdmin,
  optionalAuth,
  sensitiveOperation
};
