const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
      maxlength: 300,
    },
    description: {
      type: String,
      required: true,
    },
    propertyType: {
      type: String,
      required: true,
      enum: ['Residential', 'Commercial', 'Plot', 'Land', 'Villa', 'Apartment', 'House', 'Shop', 'Office'],
    },
    purpose: {
      type: String,
      required: true,
      enum: ['Buy', 'Sell', 'Investment'],
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      default: 'Saharanpur',
    },
    state: {
      type: String,
      default: 'Uttar Pradesh',
    },
    pincode: {
      type: String,
      default: '247662',
    },
    price: {
      type: Number,
      required: true,
    },
    priceLabel: {
      type: String,
      required: true, // e.g. "₹ 85 Lakhs" or "₹ 1.25 Cr"
    },
    area: {
      type: Number,
      required: true,
    },
    areaUnit: {
      type: String,
      default: 'Sq.Ft',
      enum: ['Sq.Ft', 'Sq.Yards', 'Acres', 'Bigha'],
    },
    bedrooms: {
      type: Number,
      default: 0,
    },
    bathrooms: {
      type: Number,
      default: 0,
    },
    floors: {
      type: Number,
      default: 1,
    },
    propertyStatus: {
      type: String,
      default: 'Available',
      enum: ['Available', 'Sold', 'Reserved', 'Coming Soon'],
    },
    amenities: {
      type: [String],
      default: [],
    },
    features: {
      type: [String],
      default: [],
    },
    googleMapsUrl: {
      type: String,
      default: '',
    },
    latitude: {
      type: Number,
      default: 30.2012,
    },
    longitude: {
      type: Number,
      default: 77.8384,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: true,
    },
    images: {
      type: [String],
      validate: [
        function (val) {
          return val.length <= 5;
        },
        'Maximum 5 images are allowed per property.',
      ],
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);
