const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ── Storage config ──
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let subDir = 'general';
    if (file.fieldname === 'projectImage' || file.fieldname === 'galleryImages') {
      subDir = 'projects';
    } else if (file.fieldname === 'projectVideos') {
      subDir = 'videos';
    }

    const dir = path.join(uploadsDir, subDir);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

// ── File filter: images + videos ──
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    return cb(null, true);
  }
  cb(new Error('Only image and video files are allowed'));
};

// ── Multer instances ──
const uploadSingle = (fieldName) => multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
}).single(fieldName);

const uploadMultiple = (fieldName, maxCount = 10) => multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 },
}).array(fieldName, maxCount);

const uploadFields = (fields) => multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 },
}).fields(fields);

module.exports = {
  uploadSingle,
  uploadMultiple,
  uploadFields,
};
