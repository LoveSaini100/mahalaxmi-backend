const express = require('express');
const router = express.Router();
const {
  getProperties,
  getPropertyBySlug,
  createProperty,
  updateProperty,
  deleteProperty,
  deletePropertyImage,
  togglePropertyStatus,
} = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');
const { handlePropertyImagesUpload } = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getProperties);
router.get('/:slug', getPropertyBySlug);

// Protected Admin routes
router.post('/', protect, handlePropertyImagesUpload, createProperty);
router.put('/:id', protect, handlePropertyImagesUpload, updateProperty);
router.delete('/:id', protect, deleteProperty);
router.delete('/:id/images', protect, deletePropertyImage);
router.patch('/:id/toggle', protect, togglePropertyStatus);

module.exports = router;
