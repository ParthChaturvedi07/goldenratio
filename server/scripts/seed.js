require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Project = require('../models/Project');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/goldenratio';

// ── Existing projects from the frontend (projectData.ts) ──
const projectsSeed = [
  {
    title: 'Urban Architecture Model',
    slug: 'urban-architecture-model',
    category: 'Industrial Models',
    description: 'A comprehensive industrial layout with complex machinery flows, meticulously crafted for precise detailing and functional planning. Highlights spatial efficiency and structural integrity.',
    image: '/images/IMG20250529191734.jpg',
    concept: 'The task was to create a comprehensive industrial layout that showcases complex machinery flows and spatial efficiency for functional planning.',
    role: 'Developed the structural layout, ensured precise detailing, and crafted the physical model for client presentation.',
    industry: 'Industrial Architecture, Manufacturing',
    gallery: [
      { src: '/images/IMG20250529191734.jpg', caption: 'Overall Layout View' },
      { src: '/images/IMG20250608163444.jpg', caption: 'Detailed Machinery Flow' },
    ],
    videos: [],
    order: 1,
  },
  {
    title: 'Eco Township Layout',
    slug: 'eco-township-layout',
    category: 'Architectural Models',
    description: 'Expansive residential township miniature focusing on green spaces, sustainable design, and modern living. Features intricate terrain mapping and lifestyle amenities.',
    image: '/images/IMG20250608163444.jpg',
    concept: 'To envision an expansive residential township miniature with a strong focus on green spaces, sustainable design, and modern living.',
    role: 'Led the terrain mapping, landscape design, and architectural modeling.',
    industry: 'Real Estate, Sustainable Development',
    gallery: [
      { src: '/images/IMG20250608163444.jpg', caption: 'Aerial View of the Township' },
      { src: '/images/IMG_0615.jpg', caption: 'Green Spaces and Amenities' },
    ],
    videos: [],
    order: 2,
  },
  {
    title: 'Corporate Headquarters',
    slug: 'corporate-headquarters',
    category: 'Commercial Models',
    description: 'High-rise commercial complex highlighting glass facades, modern structural design, and an integrated transport hub for large-scale enterprise environments.',
    image: '/images/IMG20250830225703.jpg',
    concept: 'Design a high-rise commercial complex highlighting glass facades and modern structural design.',
    role: 'Architectural modeling, facade detailing, and presentation rendering.',
    industry: 'Commercial Architecture, Corporate',
    gallery: [
      { src: '/images/IMG20250830225703.jpg', caption: 'Main Facade' },
      { src: '/images/IMG_0713.PNG', caption: 'Integrated Transport Hub' },
    ],
    videos: [],
    order: 3,
  },
  {
    title: 'Luxury Interior Concept',
    slug: 'luxury-interior-concept',
    category: 'Interior Models',
    description: 'Detailed interior layout for a premium showroom, showcasing tailored material finishes, modular furniture, and specialized lighting setups for a realistic feel.',
    image: '/images/IMG_0615.jpg',
    concept: 'Create a detailed interior layout for a premium showroom, showcasing tailored material finishes and modular furniture.',
    role: 'Interior modeling, lighting setup, and material curation.',
    industry: 'Interior Design, Retail',
    gallery: [
      { src: '/images/IMG_0615.jpg', caption: 'Showroom Entrance' },
      { src: '/images/IMG_0721.JPG', caption: 'Material Finishes Detail' },
    ],
    videos: [],
    order: 4,
  },
  {
    title: 'Smart City Development',
    slug: 'smart-city-development',
    category: 'Architectural Models',
    description: 'Master plan model incorporating IT parks, institutional buildings, and smart infrastructure. Displays zoning, road networks, and energy-efficient building placements.',
    image: '/images/IMG_20240313_115136.jpg',
    concept: 'Develop a master plan model incorporating IT parks, institutional buildings, and smart infrastructure.',
    role: 'Master planning, zoning layout, and infrastructure modeling.',
    industry: 'Urban Planning, Smart Cities',
    gallery: [
      { src: '/images/IMG_20240313_115136.jpg', caption: 'City Master Plan' },
      { src: '/images/IMG_20230930_221850.jpg', caption: 'Institutional Block' },
    ],
    videos: [],
    order: 5,
  },
  {
    title: 'Industrial Plant Layout',
    slug: 'industrial-plant-layout',
    category: 'Industrial Models',
    description: 'Detailed manufacturing plant setup showing production line sequences, loading bays, and safety zones. A vital tool for logistical planning and investor presentations.',
    image: '/images/IMG_20221110_172236.jpg',
    concept: 'Model a detailed manufacturing plant setup showing production line sequences and safety zones.',
    role: 'Logistical planning, structural modeling, and sequence detailing.',
    industry: 'Manufacturing, Logistics',
    gallery: [
      { src: '/images/IMG_20221110_172236.jpg', caption: 'Production Line Sequence' },
      { src: '/images/IMG_20230121_190329.jpg', caption: 'Loading Bays' },
    ],
    videos: [],
    order: 6,
  },
  {
    title: 'Heritage Restoration Model',
    slug: 'heritage-restoration-model',
    category: 'Architectural Models',
    description: 'Precision scale model of a heritage building restoration, capturing ornate facades, period-accurate detailing, and conservation-sensitive structural elements.',
    image: '/images/IMG20250922185808.jpg',
    concept: 'Create a precision scale model of a heritage building restoration, capturing ornate facades and period-accurate detailing.',
    role: 'Historical research, ornate detailing, and conservation modeling.',
    industry: 'Heritage Conservation, Architecture',
    gallery: [
      { src: '/images/IMG20250922185808.jpg', caption: 'Restored Facade' },
      { src: '/images/IMG_0727.JPG', caption: 'Ornate Detailing' },
    ],
    videos: [],
    order: 7,
  },
  {
    title: 'Premium Office Interiors',
    slug: 'premium-office-interiors',
    category: 'Interior Models',
    description: 'Executive office space model showcasing contemporary workspace design, ergonomic layouts, branded environments, and collaborative zones with premium finishes.',
    image: '/images/IMG20251029190139.jpg',
    concept: 'Design an executive office space model showcasing contemporary workspace design and ergonomic layouts.',
    role: 'Interior design, layout planning, and 3D modeling.',
    industry: 'Corporate Interiors, Workplace Design',
    gallery: [
      { src: '/images/IMG20251029190139.jpg', caption: 'Executive Office' },
      { src: '/images/IMG_0732.JPG', caption: 'Collaborative Zone' },
    ],
    videos: [],
    order: 8,
  },
  {
    title: 'Residential Complex',
    slug: 'residential-complex',
    category: 'Architectural Models',
    description: 'Multi-tower residential development model with landscaped gardens, recreational facilities, and community-focused design with detailed façade treatments.',
    image: '/images/IMG_0713.PNG',
    concept: 'Model a multi-tower residential development with landscaped gardens and community-focused design.',
    role: 'Tower modeling, landscape design, and amenity planning.',
    industry: 'Real Estate, Residential',
    gallery: [
      { src: '/images/IMG_0713.PNG', caption: 'Multi-tower Overview' },
      { src: '/images/IMG_0738.JPG', caption: 'Recreational Facilities' },
    ],
    videos: [],
    order: 9,
  },
  {
    title: 'Manufacturing Facility',
    slug: 'manufacturing-facility',
    category: 'Industrial Models',
    description: 'Precision-engineered factory floor layout highlighting production efficiency, safety pathways, and automated systems for investor and stakeholder presentations.',
    image: '/images/IMG_20230121_190329.jpg',
    concept: 'Develop a precision-engineered factory floor layout highlighting production efficiency and safety.',
    role: 'Factory layout planning and automated systems modeling.',
    industry: 'Industrial, Manufacturing',
    gallery: [
      { src: '/images/IMG_20230121_190329.jpg', caption: 'Factory Floor' },
      { src: '/images/IMG_20221110_172236.jpg', caption: 'Automated Systems' },
    ],
    videos: [],
    order: 10,
  },
  {
    title: 'Retail Showroom Design',
    slug: 'retail-showroom-design',
    category: 'Interior Models',
    description: 'High-end retail environment model with immersive customer journey mapping, display zone optimization, and brand-centric design elements.',
    image: '/images/IMG_0721.JPG',
    concept: 'Design a high-end retail environment model with immersive customer journey mapping.',
    role: 'Retail design, customer journey mapping, and visual merchandising modeling.',
    industry: 'Retail, Interior Design',
    gallery: [
      { src: '/images/IMG_0721.JPG', caption: 'Storefront' },
      { src: '/images/IMG_0615.jpg', caption: 'Display Zone Optimization' },
    ],
    videos: [],
    order: 11,
  },
  {
    title: 'Campus Master Plan',
    slug: 'campus-master-plan',
    category: 'Architectural Models',
    description: 'Comprehensive educational campus master plan showcasing academic blocks, auditoriums, sports facilities, and green corridors in an integrated layout.',
    image: '/images/IMG_20230930_221850.jpg',
    concept: 'Create a comprehensive educational campus master plan showcasing academic blocks and sports facilities.',
    role: 'Master planning, facility layout, and green corridor design.',
    industry: 'Education, Urban Planning',
    gallery: [
      { src: '/images/IMG_20230930_221850.jpg', caption: 'Academic Blocks' },
      { src: '/images/IMG_20240313_115136.jpg', caption: 'Campus Overview' },
    ],
    videos: [],
    order: 12,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // ── 1. Create default admin ──
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (!existingAdmin) {
      await Admin.create({
        username: 'admin',
        email: 'admin@goldenratio.build',
        password: 'goldenratio2024',
        role: 'superadmin',
      });
      console.log('✅ Default admin created:');
      console.log('   Username: admin');
      console.log('   Password: goldenratio2024');
    } else {
      console.log('ℹ️  Admin already exists, skipping...');
    }

    // ── 2. Seed projects ──
    const existingCount = await Project.countDocuments();
    if (existingCount === 0) {
      await Project.insertMany(projectsSeed);
      console.log(`✅ Seeded ${projectsSeed.length} projects`);
    } else {
      console.log(`ℹ️  ${existingCount} projects already exist, skipping seed...`);
    }

    console.log('\n🎉 Seed complete!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
