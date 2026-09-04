const Enquiry = require('../models/Enquiry');
const { getMongoStatus } = require('../config/db');
const memoryStore = require('../utils/memoryStore');

const mongoose = require('mongoose');

const createEnquiry = async (req, res) => {
  try {
    const { name, phone, email, message, property, propertyTitle } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({ success: false, message: 'Name, phone and message are required' });
    }

    if (getMongoStatus()) {
      const validPropertyId = property && mongoose.Types.ObjectId.isValid(property) ? property : null;
      const enquiry = await Enquiry.create({
        name,
        phone,
        email,
        message,
        property: validPropertyId,
        propertyTitle: propertyTitle || 'General Inquiry',
      });
      return res.status(201).json({
        success: true,
        message: 'Enquiry submitted successfully! Our team will contact you shortly.',
        data: enquiry,
      });
    }

    const newEnquiry = {
      _id: `enq-mem-${Date.now()}`,
      name,
      phone,
      email,
      message,
      propertyTitle: propertyTitle || 'General Inquiry',
      status: 'New',
      createdAt: new Date().toISOString(),
    };
    memoryStore.enquiries.unshift(newEnquiry);

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully! Our team will contact you shortly.',
      data: newEnquiry,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getEnquiries = async (req, res) => {
  try {
    if (getMongoStatus()) {
      const enquiries = await Enquiry.find()
        .populate({ path: 'property', select: 'title slug price location', strictPopulate: false })
        .sort({ createdAt: -1 });
      return res.json({ success: true, count: enquiries.length, data: enquiries });
    }

    res.json({ success: true, count: memoryStore.enquiries.length, data: memoryStore.enquiries });
  } catch (error) {
    console.error('Get enquiries error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (getMongoStatus()) {
      const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
      if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });
      return res.json({ success: true, data: enquiry });
    }

    const enq = memoryStore.enquiries.find((e) => e._id === req.params.id);
    if (enq) {
      enq.status = status;
      return res.json({ success: true, data: enq });
    }
    res.status(404).json({ success: false, message: 'Enquiry not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteEnquiry = async (req, res) => {
  try {
    if (getMongoStatus()) {
      const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
      if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });
      return res.json({ success: true, message: 'Enquiry deleted' });
    }

    const index = memoryStore.enquiries.findIndex((e) => e._id === req.params.id);
    if (index !== -1) memoryStore.enquiries.splice(index, 1);
    res.json({ success: true, message: 'Enquiry deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
};
