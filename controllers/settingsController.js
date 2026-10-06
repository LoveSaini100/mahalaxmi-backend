const Settings = require('../models/Settings');
const { getMongoStatus } = require('../config/db');
const memoryStore = require('../utils/memoryStore');

const getSettings = async (req, res) => {
  try {
    if (getMongoStatus()) {
      let settings = await Settings.findOne();
      if (!settings) {
        settings = await Settings.create({});
      } else {
        let changed = false;
        if (settings.phone !== '+91 75000 87299') {
          settings.phone = '+91 75000 87299';
          changed = true;
        }
        if (settings.whatsApp !== '+91 75000 87299') {
          settings.whatsApp = '+91 75000 87299';
          changed = true;
        }
        if (settings.companyName !== 'SHREE MAHALAXMI PROPERTIES AND CONSTRUCTION') {
          settings.companyName = 'SHREE MAHALAXMI PROPERTIES AND CONSTRUCTION';
          changed = true;
        }
        if (settings.shortName !== 'SMPC') {
          settings.shortName = 'SMPC';
          changed = true;
        }
        if (
          !settings.founderName ||
          settings.founderName === 'Mahalaxmi Management' ||
          settings.founderName === 'Mahalaxmi Property Founder' ||
          settings.founderName === 'Mr. Rakesh Sharma'
        ) {
          settings.founderName = 'Mr. Ishwar Singh Rathour';
          settings.founderTitle = 'Director and Founder';
          changed = true;
        }
        if (changed) {
          await settings.save();
        }
      }
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
