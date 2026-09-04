const Testimonial = require('../models/Testimonial');
const { getMongoStatus } = require('../config/db');
const memoryStore = require('../utils/memoryStore');

const getTestimonials = async (req, res) => {
  try {
    if (getMongoStatus()) {
      const testimonials = await Testimonial.find().sort({ createdAt: -1 });
      return res.json({ success: true, data: testimonials });
    }

    res.json({ success: true, data: memoryStore.testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createTestimonial = async (req, res) => {
  try {
    if (getMongoStatus()) {
      const testimonial = await Testimonial.create(req.body);
      return res.status(201).json({ success: true, data: testimonial });
    }

    const newT = { _id: `test-mem-${Date.now()}`, ...req.body };
    memoryStore.testimonials.unshift(newT);
    res.status(201).json({ success: true, data: newT });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateTestimonial = async (req, res) => {
  try {
    if (getMongoStatus()) {
      const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
      return res.json({ success: true, data: testimonial });
    }

    const idx = memoryStore.testimonials.findIndex((t) => t._id === req.params.id);
    if (idx !== -1) {
      memoryStore.testimonials[idx] = { ...memoryStore.testimonials[idx], ...req.body };
      return res.json({ success: true, data: memoryStore.testimonials[idx] });
    }
    res.status(404).json({ success: false, message: 'Testimonial not found' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    if (getMongoStatus()) {
      await Testimonial.findByIdAndDelete(req.params.id);
      return res.json({ success: true, message: 'Testimonial deleted' });
    }

    const idx = memoryStore.testimonials.findIndex((t) => t._id === req.params.id);
    if (idx !== -1) memoryStore.testimonials.splice(idx, 1);
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
