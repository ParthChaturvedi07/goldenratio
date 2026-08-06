const router = require('express').Router();
const { authenticateToken } = require('../../middleware/auth');
const { uploadFields } = require('../../middleware/upload');
const { cloudinary } = require('../../config/cloudinary');
const Project = require('../../models/Project');
const slugify = require('slugify');

// All admin project routes require authentication
router.use(authenticateToken);

// ── Helper: delete one Cloudinary asset ──────────────────────────────────────
async function destroyAsset(publicId, resourceType = 'image') {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.warn(`Cloudinary destroy failed for ${publicId}:`, err.message);
  }
}

// ── Helper: destroy all media tied to a project ───────────────────────────────
async function destroyProjectMedia(project) {
  const tasks = [];
  if (project.imagePublicId) tasks.push(destroyAsset(project.imagePublicId, 'image'));
  for (const img of project.gallery || []) {
    if (img.publicId) tasks.push(destroyAsset(img.publicId, 'image'));
  }
  for (const vid of project.videos || []) {
    if (vid.publicId) tasks.push(destroyAsset(vid.publicId, 'video'));
  }
  await Promise.all(tasks);
}

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
    { name: 'projectImage',  maxCount: 1  },
    { name: 'galleryImages', maxCount: 10 },
    { name: 'projectVideos', maxCount: 5  },
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

      // ── Main image ──
      let image = '';
      let imagePublicId = '';
      if (req.files?.projectImage?.[0]) {
        const f = req.files.projectImage[0];
        image         = f.path;      // Cloudinary secure_url
        imagePublicId = f.filename;  // Cloudinary public_id
      }

      if (!image) {
        return res.status(400).json({
          success: false,
          error: 'Main project image is required.',
        });
      }

      // ── Gallery images ──
      let gallery = [];
      if (req.files?.galleryImages) {
        gallery = req.files.galleryImages.map((file, i) => ({
          src:      file.path,
          publicId: file.filename,
          caption:  req.body[`galleryCaption_${i}`] || '',
        }));
      }

      // ── Videos ──
      let videos = [];
      if (req.files?.projectVideos) {
        videos = req.files.projectVideos.map((file, i) => ({
          src:      file.path,
          publicId: file.filename,
          caption:  req.body[`videoCaption_${i}`] || '',
        }));
      }

      const project = await Project.create({
        title,
        slug,
        category,
        description,
        concept:  concept  || '',
        role:     role     || '',
        industry: industry || '',
        image,
        imagePublicId,
        gallery,
        videos,
        order:    parseInt(order) || 0,
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
    { name: 'projectImage',  maxCount: 1  },
    { name: 'galleryImages', maxCount: 10 },
    { name: 'projectVideos', maxCount: 5  },
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
        project.slug  = slugify(title, { lower: true, strict: true });
      }
      if (category)            project.category    = category;
      if (description)         project.description = description;
      if (concept !== undefined)  project.concept  = concept;
      if (role    !== undefined)  project.role     = role;
      if (industry !== undefined) project.industry = industry;
      if (order   !== undefined)  project.order    = parseInt(order) || 0;
      if (isActive !== undefined) project.isActive = isActive !== 'false';

      // ── Replace main image ──
      if (req.files?.projectImage?.[0]) {
        // Delete old asset from Cloudinary
        await destroyAsset(project.imagePublicId, 'image');
        const f = req.files.projectImage[0];
        project.image         = f.path;
        project.imagePublicId = f.filename;
      }

      // ── Append new gallery images ──
      if (req.files?.galleryImages) {
        const newItems = req.files.galleryImages.map((file, i) => ({
          src:      file.path,
          publicId: file.filename,
          caption:  req.body[`galleryCaption_${i}`] || '',
        }));
        project.gallery = [...project.gallery, ...newItems];
      }

      // ── Append new videos ──
      if (req.files?.projectVideos) {
        const newItems = req.files.projectVideos.map((file, i) => ({
          src:      file.path,
          publicId: file.filename,
          caption:  req.body[`videoCaption_${i}`] || '',
        }));
        project.videos = [...project.videos, ...newItems];
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

// DELETE /api/admin/projects/:id — Delete project + all Cloudinary assets
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    await destroyProjectMedia(project);
    await project.deleteOne();

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

    const [removed] = project.gallery.splice(index, 1);
    await destroyAsset(removed.publicId, 'image');
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

    const [removed] = project.videos.splice(index, 1);
    await destroyAsset(removed.publicId, 'video');
    await project.save();

    res.json({ success: true, message: 'Video removed', data: project });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to remove video' });
  }
});

module.exports = router;
