const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Admin = require('../../models/Admin');
const { authenticateToken } = require('../../middleware/auth');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const ALLOWED_GOOGLE_EMAIL = 'yuva.illusions2@gmail.com';

/**
 * POST /api/admin/auth/google — Authenticate admin via Google ID token
 */
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ success: false, error: 'Google credential is required.' });
    }

    // Verify the token with Google
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email_verified) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }

    const email = payload.email.toLowerCase();

    // Reject anyone except the allowed email
    if (email !== ALLOWED_GOOGLE_EMAIL) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }

    const googleId = payload.sub;

    // Find or link the admin account for the allowed email
    let admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }

    // Link googleId on first successful Google login
    if (!admin.googleId) {
      admin.googleId = googleId;
      await admin.save();
    }

    // Generate JWT (same as normal login)
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(401).json({ success: false, error: 'Invalid credentials.' });
  }
});

// POST /api/admin/auth/login — Authenticate admin, return JWT
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required.',
      });
    }

    // Find admin by username or email
    const admin = await Admin.findOne({
      $or: [
        { username: username.toLowerCase() },
        { email: username.toLowerCase() },
      ],
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials.',
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials.',
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Server error during login.' });
  }
});

// POST /api/admin/auth/logout — Clear cookie
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
});

// GET /api/admin/auth/me — Get current admin info (protected)
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    admin: {
      id: req.admin._id,
      username: req.admin.username,
      email: req.admin.email,
      role: req.admin.role,
    },
  });
});
// PUT /api/admin/auth/profile — Update profile (username, email, password)
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      return res.status(404).json({ success: false, error: 'Admin not found.' });
    }

    // Require current password for any profile change
    if (!currentPassword) {
      return res.status(400).json({
        success: false,
        error: 'Current password is required to update profile.',
      });
    }

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect.',
      });
    }

    // Update username
    if (username && username !== admin.username) {
      const existing = await Admin.findOne({ username: username.toLowerCase(), _id: { $ne: admin._id } });
      if (existing) {
        return res.status(400).json({ success: false, error: 'Username already taken.' });
      }
      admin.username = username;
    }

    // Update email
    if (email && email !== admin.email) {
      const existing = await Admin.findOne({ email: email.toLowerCase(), _id: { $ne: admin._id } });
      if (existing) {
        return res.status(400).json({ success: false, error: 'Email already in use.' });
      }
      admin.email = email;
    }

    // Update password
    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, error: 'New password must be at least 6 characters.' });
      }
      admin.password = newPassword; // pre-save hook will hash it
    }

    await admin.save();

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ success: false, error: 'Failed to update profile.' });
  }
});

module.exports = router;
