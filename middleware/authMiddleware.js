const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getMongoStatus } = require('../config/db');
const memoryStore = require('../utils/memoryStore');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'mahalaxmi_property_jwt_secret_key_2026_super_secure_key'
      );

      if (getMongoStatus()) {
        const user = await User.findById(decoded.id).select('-password');
        if (user) {
          req.user = user;
          return next();
        }
      }

      // In-Memory Storage Fallback
      if (decoded.id) {
        req.user = memoryStore.admin;
        return next();
      }

      return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
    } catch (error) {
      console.error('JWT Auth Error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
