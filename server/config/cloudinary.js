const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Build a CloudinaryStorage instance for a given folder and resource type.
 * @param {string} folder - Cloudinary folder (e.g. 'goldenratio/projects')
 * @param {'image'|'video'|'auto'} resourceType
 */
const makeStorage = (folder, resourceType = 'auto') =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      resource_type: resourceType,
      // Allow common image + video formats
      allowed_formats: [
        'jpg', 'jpeg', 'png', 'gif', 'webp', 'avif',
        'mp4', 'webm', 'mov', 'avi',
      ],
    },
  });

module.exports = { cloudinary, makeStorage };
