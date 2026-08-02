const router = require('express').Router();
const { authenticateToken } = require('../../middleware/auth');
const { uploadFields } = require('../../middleware/upload');
const Project = require('../../models/Project');
const slugify = require('slugify');

// All admin project routes require authentication
router.use(authenticateToken);

// GET /api/admin/projects — List all projects (including inactive)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();

    res.json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    console.error('Admin fetch projects error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch projects' });
  }
});

// GET /api/admin/projects/:id — Get single project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).lean();
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch project' });
  }
});

// POST /api/admin/projects — Create new project
// Form fields: title, category, description, concept, role, industry, order, isActive
// File fields: projectImage (1), galleryImages (up to 10), projectVideos (up to 5)
router.post('/',
  uploadFields([
    { name: 'projectImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 10 },
    { name: 'projectVideos', maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const { title, category, description, concept, role, industry, order, isActive } = req.body;

      if (!title || !category || !description) {
        return res.status(400).json({
          success: false,
          error: 'Title, category, and description are required.',
        });
      }

      // Generate slug
      const slug = slugify(title, { lower: true, strict: true });

      // Check slug uniqueness
      const existing = await Project.findOne({ slug });
      if (existing) {
        return res.status(400).json({
          success: false,
          error: 'A project with this title already exists.',
        });
      }

      // Main image
      let image = '';
      if (req.files && req.files.projectImage && req.files.projectImage[0]) {
        image = '/uploads/projects/' + req.files.projectImage[0].filename;
      }

      if (!image) {
        return res.status(400).json({
          success: false,
          error: 'Main project image is required.',
        });
      }

      // Gallery images
      let gallery = [];
      if (req.files && req.files.galleryImages) {
        gallery = req.files.galleryImages.map((file, i) => ({
          src: '/uploads/projects/' + file.filename,
          caption: req.body[`galleryCaption_${i}`] || '',
        }));
      }

      // Videos
      let videos = [];
      if (req.files && req.files.projectVideos) {
        videos = req.files.projectVideos.map((file, i) => ({
          src: '/uploads/videos/' + file.filename,
          caption: req.body[`videoCaption_${i}`] || '',
        }));
      }

      const project = await Project.create({
        title,
        slug,
        category,
        description,
        concept: concept || '',
        role: role || '',
        industry: industry || '',
        image,
        gallery,
        videos,
        order: parseInt(order) || 0,
        isActive: isActive !== 'false',
      });

      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: project,
      });
    } catch (err) {
      console.error('Create project error:', err);
      res.status(500).json({ success: false, error: 'Failed to create project: ' + err.message });
    }
  }
);

// PUT /api/admin/projects/:id — Update project
router.put('/:id',
  uploadFields([
    { name: 'projectImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 10 },
    { name: 'projectVideos', maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ success: false, error: 'Project not found' });
      }

      const { title, category, description, concept, role, industry, order, isActive } = req.body;

      if (title) {
        project.title = title;
        project.slug = slugify(title, { lower: true, strict: true });
      }
      if (category) project.category = category;
      if (description) project.description = description;
      if (concept !== undefined) project.concept = concept;
      if (role !== undefined) project.role = role;
      if (industry !== undefined) project.industry = industry;
      if (order !== undefined) project.order = parseInt(order) || 0;
      if (isActive !== undefined) project.isActive = isActive !== 'false';

      // Update main image if new one uploaded
      if (req.files && req.files.projectImage && req.files.projectImage[0]) {
        project.image = '/uploads/projects/' + req.files.projectImage[0].filename;
      }

      // Append new gallery images
      if (req.files && req.files.galleryImages) {
        const newGalleryItems = req.files.galleryImages.map((file, i) => ({
          src: '/uploads/projects/' + file.filename,
          caption: req.body[`galleryCaption_${i}`] || '',
        }));
        project.gallery = [...project.gallery, ...newGalleryItems];
      }

      // Append new videos
      if (req.files && req.files.projectVideos) {
        const newVideoItems = req.files.projectVideos.map((file, i) => ({
          src: '/uploads/videos/' + file.filename,
          caption: req.body[`videoCaption_${i}`] || '',
        }));
        project.videos = [...project.videos, ...newVideoItems];
      }

      await project.save();

      res.json({
        success: true,
        message: 'Project updated successfully',
        data: project,
      });
    } catch (err) {
      console.error('Update project error:', err);
      res.status(500).json({ success: false, error: 'Failed to update project' });
    }
  }
);

// DELETE /api/admin/projects/:id — Delete project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully',
      data: { id: req.params.id },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete project' });
  }
});

// DELETE /api/admin/projects/:id/gallery/:index — Remove specific gallery image
router.delete('/:id/gallery/:index', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    const index = parseInt(req.params.index);
    if (index < 0 || index >= project.gallery.length) {
      return res.status(400).json({ success: false, error: 'Invalid gallery index' });
    }

    project.gallery.splice(index, 1);
    await project.save();

    res.json({ success: true, message: 'Gallery image removed', data: project });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to remove gallery image' });
  }
});

// DELETE /api/admin/projects/:id/videos/:index — Remove specific video
router.delete('/:id/videos/:index', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    const index = parseInt(req.params.index);
    if (index < 0 || index >= project.videos.length) {
      return res.status(400).json({ success: false, error: 'Invalid video index' });
    }

    project.videos.splice(index, 1);
    await project.save();

    res.json({ success: true, message: 'Video removed', data: project });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to remove video' });
  }
});

module.exports = router;
