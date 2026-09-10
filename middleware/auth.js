const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Authentication token required', errorCode: 'UNAUTHORIZED' });
    const decoded = jwt.verify(header.substring(7), process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-passwordHash');
    if (!req.user) return res.status(401).json({ success: false, message: 'User no longer exists', errorCode: 'UNAUTHORIZED' });
    if (req.user.role === 'seller' && !req.user.isApproved) return res.status(403).json({ success: false, message: 'Seller account is awaiting admin approval', errorCode: 'SELLER_NOT_APPROVED' });
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token', errorCode: 'UNAUTHORIZED' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.status(403).json({ success: false, message: 'Insufficient permissions', errorCode: 'FORBIDDEN' });
  next();
};

module.exports = { protect, authorize };
