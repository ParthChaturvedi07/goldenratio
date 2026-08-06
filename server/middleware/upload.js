const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('../config/cloudinary');

// ── Single dynamic storage — auto-routes images/videos to correct folders ──
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith('video/');
    return {
      folder:        isVideo ? 'goldenratio/videos'   : 'goldenratio/projects',
      resource_type: isVideo ? 'video'                : 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'mp4', 'webm', 'mov', 'avi'],
    };
  },
});

// ── File filter ────────────────────────────────────────────────────────────────
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    return cb(null, true);
  }
  cb(new Error('Only image and video files are allowed'));
};

// ── Multer factories ───────────────────────────────────────────────────────────
const uploadSingle = (fieldName) =>
  multer({ storage, fileFilter, limits: { fileSize: 500 * 1024 * 1024 } })
    .single(fieldName);

const uploadMultiple = (fieldName, maxCount = 10) =>
  multer({ storage, fileFilter, limits: { fileSize: 500 * 1024 * 1024 } })
    .array(fieldName, maxCount);

// Single instance handles ALL fields — no more "Unexpected field" errors
const uploadFields = (fields) =>
  multer({ storage, fileFilter, limits: { fileSize: 500 * 1024 * 1024 } })
    .fields(fields);

module.exports = { uploadSingle, uploadMultiple, uploadFields };
