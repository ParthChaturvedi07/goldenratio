const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
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
  concept: {
    type: String,
    trim: true,
    default: '',
  },
  role: {
    type: String,
    trim: true,
    default: '',
  },
  industry: {
    type: String,
    trim: true,
    default: '',
  },
  // Main thumbnail image
  image: {
    type: String,
    required: [true, 'Main image is required'],
  },
  // Gallery images
  gallery: [{
    src: { type: String, required: true },
    caption: { type: String, default: '' },
  }],
  // Project videos
  videos: [{
    src: { type: String, required: true },
    caption: { type: String, default: '' },
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

projectSchema.index({ isActive: 1, order: 1 });
projectSchema.index({ category: 1 });

module.exports = mongoose.model('Project', projectSchema);
