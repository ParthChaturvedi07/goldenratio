const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  category: {
    type: String,
    required: [true, 'Category/Department is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },

  // ── Commerce fields ──────────────────────────────────────
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  discountPrice: {
    type: Number,
    min: 0,
    default: null,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  sku: {
    type: String,
    trim: true,
    default: '',
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },

  // ── Specifications (label/value pairs) ──────────────────
  specifications: [{
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  }],

  // ── Tags ──────────────────────────────────────────────────
  tags: [{ type: String, trim: true }],

  // Main thumbnail image — Cloudinary secure URL
  image: {
    type: String,
    required: [true, 'Main image is required'],
  },
  // Cloudinary public_id for the main image (used for deletion)
  imagePublicId: {
    type: String,
    default: '',
  },
  // Gallery images
  gallery: [{
    src:       { type: String, required: true },
    publicId:  { type: String, default: '' },
    caption:   { type: String, default: '' },
  }],
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

productSchema.index({ isActive: 1, order: 1 });
productSchema.index({ category: 1 });

module.exports = mongoose.model('Product', productSchema);