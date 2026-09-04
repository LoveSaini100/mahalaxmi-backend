const Gallery = require('../models/Gallery');
const { getMongoStatus } = require('../config/db');
const memoryStore = require('../utils/memoryStore');
const { deletePhysicalFile } = require('../utils/fileHelper');

// GET /api/gallery
const getGalleryItems = async (req, res) => {
  try {
    if (getMongoStatus()) {
      const items = await Gallery.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: items.length, data: items });
    }

    res.json({ success: true, count: memoryStore.gallery.length, data: memoryStore.gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/gallery
const createGalleryItem = async (req, res) => {
  try {
    let { title, url, category, description } = req.body;

    // Handle file upload if multipart image file is uploaded
    if (req.file) {
      url = `/uploads/gallery/${req.file.filename}`;
    }

    if (!title || !url) {
      return res.status(400).json({ success: false, message: 'Title and image (url or file) are required' });
    }

    if (getMongoStatus()) {
      const item = await Gallery.create({
        title,
        url,
        category: category || 'General',
        description: description || '',
      });
      return res.status(201).json({ success: true, data: item });
    }

    const newItem = {
      _id: `gal-mem-${Date.now()}`,
      title,
      url,
      category: category || 'General',
      description: description || '',
      createdAt: new Date().toISOString(),
    };
    memoryStore.gallery.unshift(newItem);

    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/gallery/:id
const updateGalleryItem = async (req, res) => {
  try {
    let { title, url, category, description } = req.body;

    if (req.file) {
      url = `/uploads/gallery/${req.file.filename}`;
    }

    if (getMongoStatus()) {
      const existingItem = await Gallery.findById(req.params.id);
      if (!existingItem) return res.status(404).json({ success: false, message: 'Gallery photo not found' });

      // If updating with a new image, delete old file from disk if it was an uploaded file
      if (url && existingItem.url && existingItem.url !== url) {
        deletePhysicalFile(existingItem.url);
      }

      const updateData = { title, category, description };
      if (url) updateData.url = url;

      const item = await Gallery.findByIdAndUpdate(req.params.id, updateData, { new: true });
      return res.json({ success: true, data: item });
    }

    const item = memoryStore.gallery.find((g) => g._id === req.params.id);
    if (item) {
      if (url && item.url && item.url !== url) {
        deletePhysicalFile(item.url);
      }
      if (title) item.title = title;
      if (url) item.url = url;
      if (category) item.category = category;
      if (description !== undefined) item.description = description;
      return res.json({ success: true, data: item });
    }

    res.status(404).json({ success: false, message: 'Gallery photo not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/gallery/:id
const deleteGalleryItem = async (req, res) => {
  try {
    if (getMongoStatus()) {
      const item = await Gallery.findById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Gallery photo not found' });

      // Delete physical image file from uploads folder
      if (item.url) {
        deletePhysicalFile(item.url);
      }

      await Gallery.findByIdAndDelete(req.params.id);
      return res.json({ success: true, message: 'Gallery photo and file deleted from disk' });
    }

    const index = memoryStore.gallery.findIndex((g) => g._id === req.params.id);
    if (index !== -1) {
      const item = memoryStore.gallery[index];
      if (item && item.url) {
        deletePhysicalFile(item.url);
      }
      memoryStore.gallery.splice(index, 1);
    }
    res.json({ success: true, message: 'Gallery photo deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
};
