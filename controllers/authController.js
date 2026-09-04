const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { getMongoStatus } = require('../config/db');
const memoryStore = require('../utils/memoryStore');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'mahalaxmi_property_jwt_secret_key_2026_super_secure_key',
    { expiresIn: '30d' }
  );
};

// @desc    Admin Login
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if Mongo is connected
    if (getMongoStatus()) {
      let user = await User.findOne({ email: cleanEmail });

      if (!user && cleanEmail === 'admin@mahalaxmiproperty.com' && password === 'Admin@123456') {
        user = await User.create({
          name: 'Mahalaxmi Admin',
          email: 'admin@mahalaxmiproperty.com',
          password: password,
          role: 'admin',
        });
      }

      if (user && (await user.matchPassword(password))) {
        return res.json({
          success: true,
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
          },
        });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    }

    // In-Memory Storage Fallback (When local MongoDB service is offline)
    if (cleanEmail === 'admin@mahalaxmiproperty.com' && password === 'Admin@123456') {
      const admin = memoryStore.admin;
      return res.json({
        success: true,
        data: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          token: generateToken(admin._id),
        },
      });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Current Admin Profile
// @route   GET /api/auth/me
// @access  Private (Admin)
const getMe = async (req, res) => {
  try {
    if (getMongoStatus()) {
      const user = await User.findById(req.user._id).select('-password');
      return res.json({ success: true, data: user });
    }

    res.json({ success: true, data: memoryStore.admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  loginAdmin,
  getMe,
};
