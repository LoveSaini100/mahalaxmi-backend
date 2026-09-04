const Property = require('../models/Property');
const slugify = require('slugify');
const { deletePhysicalFile, deleteMultipleFiles } = require('../utils/fileHelper');
const { getMongoStatus } = require('../config/db');
const memoryStore = require('../utils/memoryStore');

// Helper to construct slug
const createUniqueSlug = async (title) => {
  let baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  if (getMongoStatus()) {
    while (await Property.findOne({ slug })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }
  } else {
    while (memoryStore.properties.some((p) => p.slug === slug)) {
      slug = `${baseSlug}-${count}`;
      count++;
    }
  }
  return slug;
};

// @desc    Get all properties with filtering, pagination & sorting
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
  try {
    const {
      search,
      propertyType,
      purpose,
      location,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      status,
      featured,
      published,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    if (getMongoStatus()) {
      const query = {};

      if (published !== undefined) {
        query.published = published === 'true';
      } else {
        query.published = true;
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
          { address: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      if (propertyType && propertyType !== 'All') query.propertyType = propertyType;
      if (purpose && purpose !== 'All') query.purpose = purpose;
      if (location) query.location = { $regex: location, $options: 'i' };
      if (status && status !== 'All') query.propertyStatus = status;
      if (featured === 'true') query.featured = true;
      if (bedrooms && bedrooms !== 'Any') query.bedrooms = { $gte: Number(bedrooms) };
      if (bathrooms && bathrooms !== 'Any') query.bathrooms = { $gte: Number(bathrooms) };

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      let sortOptions = { createdAt: -1 };
      if (sort === 'price_asc' || sort === 'price-asc') sortOptions = { price: 1 };
      if (sort === 'price_desc' || sort === 'price-desc') sortOptions = { price: -1 };
      if (sort === 'featured') sortOptions = { featured: -1, createdAt: -1 };

      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const skip = (pageNum - 1) * limitNum;

      const total = await Property.countDocuments(query);
      const properties = await Property.find(query).sort(sortOptions).skip(skip).limit(limitNum);

      return res.json({
        success: true,
        count: properties.length,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
        data: properties,
      });
    }

    // Fallback Memory Store Logic
    let filtered = [...memoryStore.properties];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (propertyType && propertyType !== 'All') filtered = filtered.filter((p) => p.propertyType === propertyType);
    if (purpose && purpose !== 'All') filtered = filtered.filter((p) => p.purpose === purpose);
    if (location) filtered = filtered.filter((p) => p.location.toLowerCase().includes(location.toLowerCase()));
    if (status && status !== 'All') filtered = filtered.filter((p) => p.propertyStatus === status);
    if (featured === 'true') filtered = filtered.filter((p) => p.featured);
    if (bedrooms && bedrooms !== 'Any') filtered = filtered.filter((p) => p.bedrooms >= Number(bedrooms));

    if (minPrice) filtered = filtered.filter((p) => p.price >= Number(minPrice));
    if (maxPrice) filtered = filtered.filter((p) => p.price <= Number(maxPrice));

    if (sort === 'price_asc' || sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc' || sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = filtered.slice(startIndex, startIndex + limitNum);

    res.json({
      success: true,
      count: paginated.length,
      total: filtered.length,
      page: pageNum,
      pages: Math.ceil(filtered.length / limitNum) || 1,
      data: paginated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single property by slug or ID
// @route   GET /api/properties/:slug
// @access  Public
const getPropertyBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (getMongoStatus()) {
      let property = await Property.findOne({ slug });
      if (!property && slug.match(/^[0-9a-fA-F]{24}$/)) {
        property = await Property.findById(slug);
      }
      if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

      property.views = (property.views || 0) + 1;
      await property.save();
      return res.json({ success: true, data: property });
    }

    // Memory store lookup
    const property = memoryStore.properties.find((p) => p.slug === slug || p._id === slug);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    res.json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new Property
// @route   POST /api/properties
// @access  Private (Admin)
const createProperty = async (req, res) => {
  try {
    const propertyData = req.body;

    if (!propertyData.slug) {
      propertyData.slug = await createUniqueSlug(propertyData.title);
    }

    if (typeof propertyData.amenities === 'string') {
      try { propertyData.amenities = JSON.parse(propertyData.amenities); } catch (e) { propertyData.amenities = []; }
    }
    if (typeof propertyData.features === 'string') {
      try { propertyData.features = JSON.parse(propertyData.features); } catch (e) { propertyData.features = []; }
    }
    if (typeof propertyData.images === 'string') {
      try { propertyData.images = JSON.parse(propertyData.images); } catch (e) { propertyData.images = []; }
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/properties/${file.filename}`);
      propertyData.images = [...(propertyData.images || []), ...newImages].slice(0, 5);
    }

    if (getMongoStatus()) {
      const property = await Property.create(propertyData);
      return res.status(201).json({ success: true, data: property });
    }

    // Memory store fallback
    const newProp = {
      _id: `prop-mem-${Date.now()}`,
      ...propertyData,
      createdAt: new Date().toISOString(),
    };
    memoryStore.properties.unshift(newProp);
    res.status(201).json({ success: true, data: newProp });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update Property
// @route   PUT /api/properties/:id
// @access  Private (Admin)
const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (typeof updateData.amenities === 'string') {
      try { updateData.amenities = JSON.parse(updateData.amenities); } catch (e) {}
    }
    if (typeof updateData.features === 'string') {
      try { updateData.features = JSON.parse(updateData.features); } catch (e) {}
    }
    if (typeof updateData.images === 'string') {
      try { updateData.images = JSON.parse(updateData.images); } catch (e) {}
    }

    if (getMongoStatus()) {
      let property = await Property.findById(id);
      if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

      if (updateData.images && Array.isArray(updateData.images)) {
        const removedImages = property.images.filter((img) => !updateData.images.includes(img));
        deleteMultipleFiles(removedImages);
      }

      if (req.files && req.files.length > 0) {
        const uploadedImages = req.files.map((file) => `/uploads/properties/${file.filename}`);
        const currentImages = Array.isArray(updateData.images) ? updateData.images : property.images;
        updateData.images = [...currentImages, ...uploadedImages].slice(0, 5);
      }

      property = await Property.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
      return res.json({ success: true, data: property });
    }

    // Memory store fallback
    const index = memoryStore.properties.findIndex((p) => p._id === id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Property not found' });

    if (req.files && req.files.length > 0) {
      const uploadedImages = req.files.map((file) => `/uploads/properties/${file.filename}`);
      const currentImages = Array.isArray(updateData.images) ? updateData.images : memoryStore.properties[index].images;
      updateData.images = [...currentImages, ...uploadedImages].slice(0, 5);
    }

    memoryStore.properties[index] = { ...memoryStore.properties[index], ...updateData };
    res.json({ success: true, data: memoryStore.properties[index] });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete Property & physical files
// @route   DELETE /api/properties/:id
// @access  Private (Admin)
const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    if (getMongoStatus()) {
      const property = await Property.findById(id);
      if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

      if (property.images && property.images.length > 0) {
        deleteMultipleFiles(property.images);
      }

      await Property.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Property and physical files deleted' });
    }

    // Memory store fallback
    const index = memoryStore.properties.findIndex((p) => p._id === id);
    if (index !== -1) {
      const prop = memoryStore.properties[index];
      deleteMultipleFiles(prop.images);
      memoryStore.properties.splice(index, 1);
    }
    res.json({ success: true, message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deletePropertyImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;
    deletePhysicalFile(imageUrl);
    res.json({ success: true, message: 'Image file deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const togglePropertyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { field } = req.body;

    if (getMongoStatus()) {
      const property = await Property.findById(id);
      if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
      if (field === 'featured') property.featured = !property.featured;
      if (field === 'published') property.published = !property.published;
      await property.save();
      return res.json({ success: true, data: property });
    }

    const prop = memoryStore.properties.find((p) => p._id === id);
    if (prop) {
      if (field === 'featured') prop.featured = !prop.featured;
      if (field === 'published') prop.published = !prop.published;
      return res.json({ success: true, data: prop });
    }
    res.status(404).json({ success: false, message: 'Property not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProperties,
  getPropertyBySlug,
  createProperty,
  updateProperty,
  deleteProperty,
  deletePropertyImage,
  togglePropertyStatus,
};
