const express = require('express');
const router = express.Router();
const {
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} = require('../controllers/galleryController');
const { protect } = require('../middleware/authMiddleware');
const { handleSingleImageUpload } = require('../middleware/uploadMiddleware');

// Public route
router.get('/', getGalleryItems);

// Protected Admin routes
router.post('/', protect, handleSingleImageUpload, createGalleryItem);
router.put('/:id', protect, handleSingleImageUpload, updateGalleryItem);
router.delete('/:id', protect, deleteGalleryItem);

module.exports = router;
