const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const Contact = require('../../models/Contact');

// POST /api/contact — Submit a new contact inquiry
router.post('/',
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('phone').optional().trim(),
    body('services').optional().isArray(),
    body('budget').optional().trim(),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array().map(e => e.msg),
        });
      }

      const { fullName, email, phone, services, budget, message } = req.body;

      const contact = await Contact.create({
        fullName,
        email,
        phone: phone || '',
        services: services || [],
        budget: budget || '',
        message,
      });

      res.status(201).json({
        success: true,
        message: 'Your inquiry has been received. We will get back to you within 24 hours.',
        data: { id: contact._id },
      });
    } catch (err) {
      console.error('Contact submission error:', err);
      res.status(500).json({
        success: false,
        message: 'Failed to submit inquiry. Please try again.',
      });
    }
  }
);

module.exports = router;
