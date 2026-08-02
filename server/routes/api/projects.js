const router = require('express').Router();
const Project = require('../../models/Project');

// GET /api/projects — List all active projects (with optional category filter)
router.get('/', async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.category && req.query.category !== 'All') {
      filter.category = req.query.category;
    }

    const projects = await Project.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .select('-__v');

    res.json({ success: true, data: projects });
  } catch (err) {
    console.error('Fetch projects error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch projects' });
  }
});

// GET /api/projects/categories — Get unique categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Project.distinct('category', { isActive: true });
    res.json({ success: true, data: ['All', ...categories] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
});

// GET /api/projects/:slug — Get single project by slug
router.get('/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({
      slug: req.params.slug,
      isActive: true,
    }).select('-__v');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, data: project });
  } catch (err) {
    console.error('Fetch project error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch project' });
  }
});

module.exports = router;
