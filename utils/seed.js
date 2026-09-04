const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Property = require('../models/Property');
const Testimonial = require('../models/Testimonial');
const Settings = require('../models/Settings');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mahalaxmi_property');
    console.log('MongoDB Connected for Seeding...');

    // Clear existing
    await User.deleteMany();
    await Property.deleteMany();
    await Testimonial.deleteMany();
    await Settings.deleteMany();

    // 1. Seed Admin User
    const admin = await User.create({
      name: 'Mahalaxmi Admin',
      email: 'admin@mahalaxmiproperty.com',
      password: 'Admin@123456',
      role: 'admin',
    });
    console.log('Admin user seeded:', admin.email);

    // 2. Seed Site Settings
    await Settings.create({
      companyName: 'MAHALAXMI PROPERTY',
      tagline: 'Your Gateway to Dream Homes & Prosperity',
      phone: '+91 9917970750',
      whatsApp: '+91 9917970750',
      address: 'Near Pencho Restaurant, Dehradun–Saharanpur Highway, Biharigarh, 247662, Saharanpur, Uttar Pradesh',
      email: 'contact@mahalaxmiproperty.com',
      founderName: 'Mr. Rakesh Sharma',
      founderTitle: 'Founder & Managing Director',
      founderMessage: 'At Mahalaxmi Property, our mission is built on transparency, integrity, and long-term customer trust. Whether you are acquiring land along the Dehradun-Saharanpur economic corridor or securing a modern home for your family, we provide expert guidance every step of the way.',
      businessHours: 'Monday - Saturday: 9:00 AM - 7:30 PM | Sunday: 10:00 AM - 4:00 PM',
      seoTitle: 'Mahalaxmi Property - Premium Real Estate in Biharigarh & Saharanpur',
      seoDescription: 'Find premium residential homes, commercial plots, and prime land along Dehradun-Saharanpur Highway with Mahalaxmi Property.',
    });
    console.log('Site settings seeded.');

    // 3. Seed Properties
    const properties = [
      {
        title: 'Luxury 4 BHK Highway Facing Villa',
        slug: 'luxury-4bhk-highway-facing-villa-biharigarh',
        shortDescription: 'Modern double-story luxury villa with private lawn, power backup, and prime highway access.',
        description: 'An elegant 4-Bedroom modern contemporary villa built with high-grade finishes, grand living space, modular Italian kitchen, covered car parking, and lush landscaped garden located right off the Dehradun-Saharanpur Highway in Biharigarh.',
        propertyType: 'Villa',
        purpose: 'Buy',
        location: 'Dehradun-Saharanpur Highway, Biharigarh',
        address: 'Near Pencho Restaurant, Highway Corridor',
        city: 'Saharanpur',
        state: 'Uttar Pradesh',
        pincode: '247662',
        price: 12500000,
        priceLabel: '₹ 1.25 Crore',
        area: 2800,
        areaUnit: 'Sq.Ft',
        bedrooms: 4,
        bathrooms: 4,
        floors: 2,
        propertyStatus: 'Available',
        amenities: ['Private Garden', 'Modular Kitchen', 'Car Parking', '24x7 Power Backup', 'Security CCTV', 'Wide Road Access'],
        features: ['Highway Frontage', 'Vaastu Compliant', 'Clear Title Deed', 'High Ceiling', 'Balcony View'],
        googleMapsUrl: 'https://maps.google.com/?q=30.2012,77.8384',
        latitude: 30.2012,
        longitude: 77.8384,
        featured: true,
        published: true,
        images: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
        ]
      },
      {
        title: 'Prime Commercial Plot on Dehradun Highway',
        slug: 'prime-commercial-plot-dehradun-highway-biharigarh',
        shortDescription: 'High-value commercial land ideal for hotel, showroom, restaurant, or petrol pump.',
        description: 'Prime commercial plot with 120 ft main highway frontage. Strategically situated near popular food hubs and transit routes between Dehradun and Saharanpur. Perfect investment opportunity with rapid capital appreciation.',
        propertyType: 'Commercial',
        purpose: 'Investment',
        location: 'Biharigarh Highway Hub',
        address: 'Main Dehradun–Saharanpur Road, Biharigarh',
        city: 'Saharanpur',
        state: 'Uttar Pradesh',
        pincode: '247662',
        price: 35000000,
        priceLabel: '₹ 3.50 Crore',
        area: 12000,
        areaUnit: 'Sq.Ft',
        bedrooms: 0,
        bathrooms: 0,
        floors: 0,
        propertyStatus: 'Available',
        amenities: ['Main Highway Frontage', 'Commercial Electricity Connection', 'Water Line', 'Corner Location'],
        features: ['High Footfall Zone', 'Clear Boundary Wall', 'Immediate Possession', 'High ROI'],
        googleMapsUrl: 'https://maps.google.com/?q=30.1980,77.8410',
        latitude: 30.1980,
        longitude: 77.8410,
        featured: true,
        published: true,
        images: [
          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1628744876497-eb30460be9f6?auto=format&fit=crop&w=1200&q=80'
        ]
      },
      {
        title: '3 BHK Modern Independent House',
        slug: '3-bhk-modern-independent-house-saharanpur-road',
        shortDescription: 'Beautiful 3 BHK ground-plus-one storey home with spacious rooms and peaceful surroundings.',
        description: 'Move-in ready independent home crafted with quality materials, spacious bedrooms with attached bathrooms, elegant marble flooring, expansive terrace, and covered parking slot.',
        propertyType: 'House',
        purpose: 'Buy',
        location: 'Saharanpur Road, Biharigarh',
        address: 'Green Park Colony, Biharigarh',
        city: 'Saharanpur',
        state: 'Uttar Pradesh',
        pincode: '247662',
        price: 6800000,
        priceLabel: '₹ 68 Lakhs',
        area: 1650,
        areaUnit: 'Sq.Ft',
        bedrooms: 3,
        bathrooms: 3,
        floors: 2,
        propertyStatus: 'Available',
        amenities: ['Modular Kitchen', 'Covered Parking', 'Terrace Access', 'Overhead Tank', 'LED Lighting'],
        features: ['Peaceful Locality', 'Good Natural Light', 'Nearby Schools & Hospital'],
        googleMapsUrl: 'https://maps.google.com/?q=30.2030,77.8350',
        latitude: 30.2030,
        longitude: 77.8350,
        featured: true,
        published: true,
        images: [
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
        ]
      },
      {
        title: 'Agricultural & Farm Land (5 Bigha)',
        slug: 'agricultural-farm-land-5-bigha-biharigarh',
        shortDescription: 'Fertile agricultural farmland suitable for farmhouse development or organic farming.',
        description: '5 Bigha fertile agricultural plot with tube-well irrigation access, gated boundary options, and wide connecting road. Located in a scenic green belt close to Foothills.',
        propertyType: 'Land',
        purpose: 'Buy',
        location: 'Foothill Green Belt, Biharigarh',
        address: 'Near Pencho Link Road',
        city: 'Saharanpur',
        state: 'Uttar Pradesh',
        pincode: '247662',
        price: 4500000,
        priceLabel: '₹ 45 Lakhs',
        area: 5,
        areaUnit: 'Bigha',
        bedrooms: 0,
        bathrooms: 0,
        floors: 0,
        propertyStatus: 'Available',
        amenities: ['Borewell / Tube-well Water', 'Electricity Line', 'Road Access'],
        features: ['Scenic Mountain Backdrop', 'High Yield Soil', 'Clear Title Land'],
        googleMapsUrl: 'https://maps.google.com/?q=30.2080,77.8450',
        latitude: 30.2080,
        longitude: 77.8450,
        featured: false,
        published: true,
        images: [
          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
        ]
      },
      {
        title: 'Premium Highway Commercial Shop',
        slug: 'premium-highway-commercial-shop-biharigarh',
        shortDescription: 'Ground floor retail shop space in high footfall commercial complex.',
        description: 'Prime retail shop space measuring 450 sq.ft on main market stretch of Biharigarh highway junction. Ideal for bank ATM, retail store, pharmacy, or office space.',
        propertyType: 'Shop',
        purpose: 'Buy',
        location: 'Main Market, Biharigarh',
        address: 'Highway Plaza, Biharigarh',
        city: 'Saharanpur',
        state: 'Uttar Pradesh',
        pincode: '247662',
        price: 3200000,
        priceLabel: '₹ 32 Lakhs',
        area: 450,
        areaUnit: 'Sq.Ft',
        bedrooms: 0,
        bathrooms: 1,
        floors: 1,
        propertyStatus: 'Available',
        amenities: ['Shutter Door', '3 Phase Power', 'Parking Frontage', 'CCTV Provision'],
        features: ['High Footfall Area', 'Corner Unit', 'Immediate Rental Income Potential'],
        googleMapsUrl: 'https://maps.google.com/?q=30.2005,77.8390',
        latitude: 30.2005,
        longitude: 77.8390,
        featured: true,
        published: true,
        images: [
          'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
        ]
      },
      {
        title: 'Residential Gated Plot 200 Sq.Yards',
        slug: 'residential-gated-plot-200-sqyards-biharigarh',
        shortDescription: 'Approved residential plot in gated community with streetlights and wide internal roads.',
        description: 'Corner residential plot ready for immediate home construction. Situated in a secured residential layout featuring 30 ft wide paved roads, underground drainage, and electricity poles.',
        propertyType: 'Plot',
        purpose: 'Buy',
        location: 'Mahalaxmi Enclave, Biharigarh',
        address: 'Plot No. 24, Dehradun Highway Road',
        city: 'Saharanpur',
        state: 'Uttar Pradesh',
        pincode: '247662',
        price: 2400000,
        priceLabel: '₹ 24 Lakhs',
        area: 200,
        areaUnit: 'Sq.Yards',
        bedrooms: 0,
        bathrooms: 0,
        floors: 0,
        propertyStatus: 'Available',
        amenities: ['Gated Entrance', 'Street Lighting', '30ft Wide Road', 'Drainage Connection'],
        features: ['East Facing', 'Vaastu Approved', 'Ready for Registry'],
        googleMapsUrl: 'https://maps.google.com/?q=30.2040,77.8360',
        latitude: 30.2040,
        longitude: 77.8360,
        featured: false,
        published: true,
        images: [
          'https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&w=1200&q=80'
        ]
      }
    ];

    await Property.insertMany(properties);
    console.log(`${properties.length} properties seeded successfully.`);

    // 4. Seed Testimonials
    const testimonials = [
      {
        name: 'Amit Verma',
        location: 'Dehradun',
        review: 'Mahalaxmi Property helped me purchase a prime commercial plot in Biharigarh with absolute ease. Their verification process and honest advice made all the difference.',
        rating: 5,
      },
      {
        name: 'Rajesh Kumar',
        location: 'Saharanpur',
        review: 'Extremely professional real estate team! They guided me through every step of paperwork and title verification for my independent villa.',
        rating: 5,
      },
      {
        name: 'Sunita Sharma',
        location: 'Delhi NCR',
        review: 'I bought agricultural land near the Dehradun Highway through Mahalaxmi Property. Transparent deals and very friendly customer service.',
        rating: 5,
      }
    ];

    await Testimonial.insertMany(testimonials);
    console.log('Testimonials seeded.');

    console.log('--- SEEDING COMPLETE ---');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seedData();
