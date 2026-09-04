const Settings = require('../models/Settings');
const { getMongoStatus } = require('../config/db');
const memoryStore = require('../utils/memoryStore');

const getSettings = async (req, res) => {
  try {
    if (getMongoStatus()) {
      let settings = await Settings.findOne();
      if (!settings) settings = await Settings.create({});
      return res.json({ success: true, data: settings });
    }

    res.json({ success: true, data: memoryStore.settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    if (getMongoStatus()) {
      let settings = await Settings.findOne();
      if (!settings) {
        settings = await Settings.create(req.body);
      } else {
        settings = await Settings.findByIdAndUpdate(settings._id, req.body, { new: true });
      }
      return res.json({ success: true, data: settings });
    }

    memoryStore.settings = { ...memoryStore.settings, ...req.body };
    res.json({ success: true, data: memoryStore.settings });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
