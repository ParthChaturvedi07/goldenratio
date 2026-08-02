const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * Authenticate JWT token.
 * Checks: Authorization header (Bearer token) OR httpOnly cookie.
 * Attaches admin user to req.admin on success.
 */
const authenticateToken = async (req, res, next) => {
  try {
    // Check Authorization header first, then cookie
    let token = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Provide a Bearer token or login.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Admin account not found.',
      });
    }

    req.admin = admin;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, error: 'Token expired. Please login again.' });
    }
    return res.status(401).json({ success: false, error: 'Invalid token.' });
  }
};

/**
 * Role-based authorization guard.
 * Must be used AFTER authenticateToken.
 */
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions.',
      });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRole };
