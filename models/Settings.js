const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      default: 'MAHALAXMI PROPERTY',
    },
    tagline: {
      type: String,
      default: 'Your Gateway to Dream Homes & Prosperity',
    },
    phone: {
      type: String,
      default: '+91 9917970750',
    },
    whatsApp: {
      type: String,
      default: '+91 9917970750',
    },
    address: {
      type: String,
      default: 'Near Pencho Restaurant, Dehradun–Saharanpur Highway, Biharigarh, 247662, Saharanpur, Uttar Pradesh',
    },
    email: {
      type: String,
      default: 'sales@mahalaxmipropertiesindia.com',
    },
    founderName: {
      type: String,
      default: 'Mr. Ishwar Singh Rathour',
    },
    founderTitle: {
      type: String,
      default: 'Director and Founder',
    },
    founderMessage: {
      type: String,
      default: 'Welcome to Mahalaxmi Property. Our commitment is founded on trust, absolute transparency, and delivering exceptional value for every client. Whether you are looking for your dream residence, prime commercial space, or high-yield land investments along the Dehradun-Saharanpur corridor, we are dedicated to guiding you through every step of your real estate journey.',
    },
    businessHours: {
      type: String,
      default: 'Mon - Sat: 9:00 AM - 7:30 PM | Sun: 10:00 AM - 5:00 PM',
    },
    seoTitle: {
      type: String,
      default: 'Best Property Dealer in Biharigarh | Mahalaxmi Property - Top Property Advisor in Saharanpur',
    },
    seoDescription: {
      type: String,
      default: 'Mahalaxmi Property is the best property dealer and trusted real estate advisor in Biharigarh, Chutmalpur, Gagalheri, Behat & Saharanpur. Buy residential plots, commercial land, and farmhouses along Dehradun Highway NH-307.',
    },
    socialLinks: {
      facebook: { type: String, default: '#' },
      instagram: { type: String, default: '#' },
      youtube: { type: String, default: '#' },
      linkedin: { type: String, default: '#' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
