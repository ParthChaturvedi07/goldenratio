const router = require('express').Router();
const { authenticateToken } = require('../../middleware/auth');
const Contact = require('../../models/Contact');

// All admin contact routes require authentication
router.use(authenticateToken);

// GET /api/admin/contacts — List all contacts with optional filters
// Query params: ?status=new|contacted|closed  &page=1  &limit=20
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const statusFilter = req.query.status || '';

    const filter = {};
    if (statusFilter && ['new', 'contacted', 'closed'].includes(statusFilter)) {
      filter.status = statusFilter;
    }

    const [contacts, total] = await Promise.all([
      Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Contact.countDocuments(filter),
    ]);

    res.json({
      success: true,
      count: contacts.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: contacts,
    });
  } catch (err) {
    console.error('Admin fetch contacts error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch contacts' });
  }
});

// GET /api/admin/contacts/:id — Get single contact
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id).lean();
    if (!contact) {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }
    res.json({ success: true, data: contact });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch contact' });
  }
});

// PUT /api/admin/contacts/:id — Update contact status/notes
router.put('/:id', async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const update = {};

    if (status && ['new', 'contacted', 'closed'].includes(status)) {
      update.status = status;
    }
    if (adminNotes !== undefined) {
      update.adminNotes = adminNotes;
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    ).lean();

    if (!contact) {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }

    res.json({
      success: true,
      message: 'Contact updated',
      data: contact,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update contact' });
  }
});

// DELETE /api/admin/contacts/:id — Delete contact
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }
    res.json({
      success: true,
      message: 'Contact deleted',
      data: { id: req.params.id },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete contact' });
  }
});

module.exports = router;
