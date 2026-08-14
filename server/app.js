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
const allowedOrigins = [
  process.env.FRONTEND_URL     || 'http://localhost:3000',  // public frontend
  process.env.ADMIN_URL        || 'http://localhost:5173',  // admin frontend
  'http://localhost:5174',
  'https://goldenratio-dun.vercel.app',       // public frontend (Vercel)
  'https://goldenratio-8hnm.vercel.app',      // admin frontend (Vercel)
  'https://grcreation.in',                    // production custom domain
  'https://www.grcreation.in',                // production custom domain (www)
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman, SSR)
    if (!origin) return callback(null, true);
    
    // Allow explicitly defined origins, any Vercel deployment, or local development
    if (
      allowedOrigins.includes(origin) || 
      origin.endsWith('.vercel.app') || 
      origin.startsWith('http://localhost:')
    ) {
      return callback(null, true);
    }
    
    // For other origins, reflect it to allow custom domains added to Vercel
    // but log a warning (instead of throwing a 500 error which breaks the app)
    console.warn(`Unrecognized CORS Origin: ${origin} - allowing to prevent proxy failures`);
    callback(null, true);
  },
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
app.use('/api/products', require('./routes/api/products'));

// ──────────────────────────────────────────────────────────
//  ADMIN API ROUTES (JWT Protected)
// ──────────────────────────────────────────────────────────
app.use('/api/admin/auth', require('./routes/admin/auth'));
app.use('/api/admin/projects', require('./routes/admin/projects'));
app.use('/api/admin/products', require('./routes/admin/products'));
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