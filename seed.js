const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Property = require('./models/Property');
const Testimonial = require('./models/Testimonial');
const User = require('./models/User');

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mahalaxmi_property';

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected successfully!');

    // Clear existing collections
    await Property.deleteMany({});
    await Testimonial.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data.');

    // Seed Admin User
    const admin = await User.create({
      name: 'Mahalaxmi Admin',
      email: 'admin@mahalaxmiproperty.in',
      password: 'mahalaxmi@123456',
      role: 'admin',
    });
    console.log(`Created Admin user: ${admin.email}`);

    // Seed 6 Properties
    const properties = [
      {
        title: 'Luxury 4 BHK Highway Facing Villa',
        slug: 'luxury-4bhk-highway-facing-villa-biharigarh',
        shortDescription: 'Modern double-story luxury villa with private lawn, road frontage & premium fittings.',
        description: 'Expansive 4 BHK villa located directly on Dehradun–Saharanpur Highway corridor. Features modular kitchen, spacious balconies, master suite with walk-in closet, 24/7 water supply, gated security entrance, and private car parking.',
        propertyType: 'Villa',
        purpose: 'Buy',
        location: 'Dehradun-Saharanpur Highway, Biharigarh',
        address: 'Near Pencho Restaurant, Biharigarh Highway Hub',
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
        amenities: ['Highway Access', 'Gated Security', 'Private Lawn', 'Car Parking', 'Modular Kitchen', 'Power Backup'],
        features: ['24/7 Water Supply', 'Corner Plot', 'Wide Front Road', 'Clear Title Registry'],
        googleMapsUrl: 'https://maps.google.com/?q=30.2012,77.8384',
        latitude: 30.2012,
        longitude: 77.8384,
        featured: true,
        published: true,
        images: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
        ],
      },
      {
        title: 'Prime Commercial Plot (12000 Sq.Ft)',
        slug: 'prime-commercial-plot-12000-sqft-biharigarh',
        shortDescription: 'High-value commercial land ideal for showroom, hotel, highway dhaba or petrol pump.',
        description: 'Strategic commercial plot with 150 feet main highway frontage. High footfall area with excellent connectivity between Saharanpur and Dehradun. Completely clear title with immediate registry option.',
        propertyType: 'Commercial',
        purpose: 'Investment',
        location: 'Biharigarh Highway Commercial Hub',
        address: 'Main Dehradun Highway, Biharigarh',
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
        amenities: ['150ft Wide Frontage', 'Commercial Zone', 'High Speed Connectivity'],
        features: ['Immediate Possession', 'High Appreciation Potential'],
        googleMapsUrl: 'https://maps.google.com/?q=30.2050,77.8400',
        latitude: 30.2050,
        longitude: 77.8400,
        featured: true,
        published: true,
        images: [
          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1628744876497-eb30460be9f6?auto=format&fit=crop&w=1200&q=80'
        ],
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
        amenities: ['Modular Kitchen', 'Covered Parking', 'Terrace Access'],
        features: ['Peaceful Locality', 'Good Natural Light'],
        googleMapsUrl: 'https://maps.google.com/?q=30.2030,77.8350',
        latitude: 30.2030,
        longitude: 77.8350,
        featured: true,
        published: true,
        images: [
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80'
        ],
      },
      {
        title: 'Agricultural & Farm Land (5 Bigha)',
        slug: 'agricultural-farm-land-5-bigha-biharigarh',
        shortDescription: 'Fertile agricultural farmland suitable for farmhouse development or organic farming.',
        description: '5 Bigha fertile agricultural plot with tube-well irrigation access, gated boundary options, and wide connecting road.',
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
        amenities: ['Tube-well Water', 'Electricity Line'],
        features: ['Scenic Mountain Backdrop', 'High Yield Soil'],
        googleMapsUrl: 'https://maps.google.com/?q=30.2080,77.8450',
        latitude: 30.2080,
        longitude: 77.8450,
        featured: true,
        published: true,
        images: [
          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
        ],
      },
      {
        title: 'Commercial Highway Showroom Space',
        slug: 'commercial-highway-showroom-space-biharigarh',
        shortDescription: 'Prime ground-floor commercial showroom space on main highway with high visibility.',
        description: 'Ready-to-occupy commercial showroom space ideal for retail brands, banks, automobile showrooms, or corporate regional offices.',
        propertyType: 'Commercial',
        purpose: 'Buy',
        location: 'Dehradun-Saharanpur Highway, Biharigarh',
        address: 'Commercial Plaza, Highway Junction',
        city: 'Saharanpur',
        state: 'Uttar Pradesh',
        pincode: '247662',
        price: 8500000,
        priceLabel: '₹ 85 Lakhs',
        area: 2200,
        areaUnit: 'Sq.Ft',
        bedrooms: 0,
        bathrooms: 2,
        floors: 1,
        propertyStatus: 'Available',
        amenities: ['Ample Parking', 'Glass Frontage', 'Power Backup', 'Gated Security'],
        features: ['Main Road Facing', 'High Footfall Area'],
        googleMapsUrl: 'https://maps.google.com/?q=30.2025,77.8390',
        latitude: 30.2025,
        longitude: 77.8390,
        featured: true,
        published: true,
        images: [
          'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
        ],
      },
      {
        title: 'Gated Residential Plot (200 Sq.Yards)',
        slug: 'gated-residential-plot-200-sqyards-biharigarh',
        shortDescription: 'Corner residential plot in peaceful gated colony near Dehradun Highway.',
        description: 'East-facing 200 Sq.Yards plot with 30ft wide internal road, underground drainage, streetlight connection, and quick connectivity to Pencho Highway Hub.',
        propertyType: 'Plot',
        purpose: 'Buy',
        location: 'Greenfield Colony, Biharigarh',
        address: 'Plot No. 42, Greenfield Society',
        city: 'Saharanpur',
        state: 'Uttar Pradesh',
        pincode: '247662',
        price: 2800000,
        priceLabel: '₹ 28 Lakhs',
        area: 200,
        areaUnit: 'Sq.Yards',
        bedrooms: 0,
        bathrooms: 0,
        floors: 0,
        propertyStatus: 'Available',
        amenities: ['Gated Boundary', 'Street Lights', '30ft Wide Road'],
        features: ['East Facing', 'Clear Registry Title'],
        googleMapsUrl: 'https://maps.google.com/?q=30.2040,77.8360',
        latitude: 30.2040,
        longitude: 77.8360,
        featured: true,
        published: true,
        images: [
          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
        ],
      },
    ];

    const insertedProperties = await Property.insertMany(properties);
    console.log(`Inserted ${insertedProperties.length} Properties.`);

    // Seed 6 Testimonials
    const testimonials = [
      {
        name: 'Amit Verma',
        location: 'Dehradun',
        review: 'Mahalaxmi Property helped me purchase a prime commercial plot in Biharigarh with absolute ease.',
        rating: 5,
      },
      {
        name: 'Rajesh Kumar',
        location: 'Saharanpur',
        review: 'Extremely professional real estate team! They guided me through every step of paperwork.',
        rating: 5,
      },
      {
        name: 'Vikas Sharma',
        location: 'Haridwar',
        review: 'Bought a 2 Bigha plot on Dehradun-Saharanpur Highway through Mahalaxmi Property. Very transparent dealing with complete legal paper check.',
        rating: 5,
      },
      {
        name: 'Priya Chaudhari',
        location: 'Roorkee',
        review: 'Their team is genuinely trustworthy. They arranged quick site visits, clear negotiations with seller, and hassle-free registry assistance.',
        rating: 5,
      },
      {
        name: 'Sunil Gupta',
        location: 'Delhi NCR',
        review: 'Invested in commercial property near Biharigarh Pencho Highway junction. Exceptional guidance on land appreciation and future ROI!',
        rating: 5,
      },
      {
        name: 'Sanjay Rastogi',
        location: 'Chandigarh',
        review: 'Seamless experience purchasing a modern independent villa. Highly recommend Mahalaxmi Property for reliable real estate deals in UP & Uttarakhand.',
        rating: 5,
      },
    ];

    const insertedTestimonials = await Testimonial.insertMany(testimonials);
    console.log(`Inserted ${insertedTestimonials.length} Testimonials.`);

    console.log('DB Seed complete successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding DB:', error);
    process.exit(1);
  }
};

seedData();
