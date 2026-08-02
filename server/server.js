require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/goldenratio';

// ── Connect to MongoDB then start server ──
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');

    app.listen(PORT, () => {
      console.log(`\n🏛️  Golden Ratio Server running on http://localhost:${PORT}`);
      console.log(`📋 Admin Panel:  http://localhost:${PORT}/admin/login`);
      console.log(`🔌 API Base:     http://localhost:${PORT}/api\n`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
