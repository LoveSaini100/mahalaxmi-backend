const express = require('express');
const router = express.Router();
const {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} = require('../controllers/enquiryController');
const { protect } = require('../middleware/authMiddleware');

const rateLimit = require('express-rate-limit');

const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many enquiry submissions from this IP, please try again later.' },
});

router.post('/', enquiryLimiter, createEnquiry);
router.get('/', protect, getEnquiries);
router.put('/:id', protect, updateEnquiryStatus);
router.delete('/:id', protect, deleteEnquiry);

module.exports = router;
