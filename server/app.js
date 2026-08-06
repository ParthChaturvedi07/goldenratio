const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// ── Security ──
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// ── Logging ──
app.use(morgan('dev'));

// ── CORS ──
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://goldenratio-8hnm.vercel.app',
  ],
  credentials: true,
}));

// ── Body Parsing ──
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Cookies ──
app.use(cookieParser(process.env.COOKIE_SECRET));

// ── Static Files ──
// Media is now served from Cloudinary CDN — no local static routes needed.

// ──────────────────────────────────────────────────────────
//  PUBLIC API ROUTES
// ──────────────────────────────────────────────────────────
app.use('/api/contact', require('./routes/api/contact'));
app.use('/api/projects', require('./routes/api/projects'));

// ──────────────────────────────────────────────────────────
//  ADMIN API ROUTES (JWT Protected)
// ──────────────────────────────────────────────────────────
app.use('/api/admin/auth', require('./routes/admin/auth'));
app.use('/api/admin/projects', require('./routes/admin/projects'));
app.use('/api/admin/contacts', require('./routes/admin/contacts'));

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 Handler ──
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// ── Error Handler ──
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

module.exports = app;
