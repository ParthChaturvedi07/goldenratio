const router = require('express').Router();
const { authenticateToken } = require('../../middleware/auth');
const { uploadFields } = require('../../middleware/upload');
const { cloudinary } = require('../../config/cloudinary');
const Product = require('../../models/Product');
const slugify = require('slugify');

// All admin product routes require authentication
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

// ── Helper: destroy all media tied to a product ───────────────────────────────
async function destroyProductMedia(product) {
  const tasks = [];
  if (product.imagePublicId) tasks.push(destroyAsset(product.imagePublicId, 'image'));
  for (const img of product.gallery || []) {
    if (img.publicId) tasks.push(destroyAsset(img.publicId, 'image'));
  }
  await Promise.all(tasks);
}

// ── Helper: parse specifications sent as JSON string or array ──
function parseSpecifications(raw) {
  if (!raw) return [];
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((s) => s && s.label && s.value)
      .map((s) => ({ label: String(s.label).trim(), value: String(s.value).trim() }));
  } catch {
    return [];
  }
}

// ── Helper: parse tags sent as JSON string, CSV string, or array ──
function parseTags(raw) {
  if (!raw) return [];
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (Array.isArray(parsed)) return parsed.map((t) => String(t).trim()).filter(Boolean);
  } catch {
    // Not JSON — fall back to comma-separated string
    if (typeof raw === 'string') {
      return raw.split(',').map((t) => t.trim()).filter(Boolean);
    }
  }
  return [];
}

// GET /api/admin/products — List all products (including inactive)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();

    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    console.error('Admin fetch products error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

// GET /api/admin/products/:id — Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
});

// POST /api/admin/products — Create new product
// Form fields: title, category, description, price, discountPrice, currency, sku,
//              stock, specifications (JSON), tags (JSON/CSV), order, isActive
// File fields: productImage (1), galleryImages (up to 10)
router.post('/',
  uploadFields([
    { name: 'productImage',  maxCount: 1  },
    { name: 'galleryImages', maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const {
        title, category, description,
        price, discountPrice, currency, sku, stock,
        specifications, tags, order, isActive,
      } = req.body;

      if (!title || !category || !description) {
        return res.status(400).json({
          success: false,
          error: 'Title, category, and description are required.',
        });
      }

      if (price === undefined || price === null || price === '' || isNaN(parseFloat(price))) {
        return res.status(400).json({
          success: false,
          error: 'A valid price is required.',
        });
      }

      // Generate slug
      const slug = slugify(title, { lower: true, strict: true });

      // Check slug uniqueness
      const existing = await Product.findOne({ slug });
      if (existing) {
        return res.status(400).json({
          success: false,
          error: 'A product with this title already exists.',
        });
      }

      // ── Main image ──
      let image = '';
      let imagePublicId = '';
      if (req.files?.productImage?.[0]) {
        const f = req.files.productImage[0];
        image         = f.path;      // Cloudinary secure_url
        imagePublicId = f.filename;  // Cloudinary public_id
      }

      if (!image) {
        return res.status(400).json({
          success: false,
          error: 'Main product image is required.',
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

      const product = await Product.create({
        title,
        slug,
        category,
        description,
        price:         parseFloat(price),
        discountPrice: discountPrice !== undefined && discountPrice !== '' ? parseFloat(discountPrice) : null,
        currency:      currency || 'INR',
        sku:           sku || '',
        stock:         stock !== undefined ? (parseInt(stock) || 0) : 0,
        specifications: parseSpecifications(specifications),
        tags:          parseTags(tags),
        image,
        imagePublicId,
        gallery,
        order:    parseInt(order) || 0,
        isActive: isActive !== 'false',
      });

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product,
      });
    } catch (err) {
      console.error('Create product error:', err);
      res.status(500).json({ success: false, error: 'Failed to create product: ' + err.message });
    }
  }
);

// PUT /api/admin/products/:id — Update product
router.put('/:id',
  uploadFields([
    { name: 'productImage',  maxCount: 1  },
    { name: 'galleryImages', maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }

      const {
        title, category, description,
        price, discountPrice, currency, sku, stock,
        specifications, tags, order, isActive,
      } = req.body;

      if (title) {
        product.title = title;
        product.slug  = slugify(title, { lower: true, strict: true });
      }
      if (category)            product.category    = category;
      if (description)         product.description = description;

      if (price !== undefined && price !== '' && !isNaN(parseFloat(price))) {
        product.price = parseFloat(price);
      }
      if (discountPrice !== undefined) {
        product.discountPrice = discountPrice === '' ? null : parseFloat(discountPrice);
      }
      if (currency !== undefined)  product.currency = currency || 'INR';
      if (sku !== undefined)       product.sku      = sku;
      if (stock !== undefined)     product.stock    = parseInt(stock) || 0;
      if (specifications !== undefined) product.specifications = parseSpecifications(specifications);
      if (tags !== undefined)      product.tags     = parseTags(tags);
      if (order   !== undefined)   product.order    = parseInt(order) || 0;
      if (isActive !== undefined)  product.isActive = isActive !== 'false';

      // ── Replace main image ──
      if (req.files?.productImage?.[0]) {
        // Delete old asset from Cloudinary
        await destroyAsset(product.imagePublicId, 'image');
        const f = req.files.productImage[0];
        product.image         = f.path;
        product.imagePublicId = f.filename;
      }

      // ── Append new gallery images ──
      if (req.files?.galleryImages) {
        const newItems = req.files.galleryImages.map((file, i) => ({
          src:      file.path,
          publicId: file.filename,
          caption:  req.body[`galleryCaption_${i}`] || '',
        }));
        product.gallery = [...product.gallery, ...newItems];
      }

      await product.save();

      res.json({
        success: true,
        message: 'Product updated successfully',
        data: product,
      });
    } catch (err) {
      console.error('Update product error:', err);
      res.status(500).json({ success: false, error: 'Failed to update product' });
    }
  }
);

// DELETE /api/admin/products/:id — Delete product + all Cloudinary assets
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    await destroyProductMedia(product);
    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product deleted successfully',
      data: { id: req.params.id },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete product' });
  }
});

// DELETE /api/admin/products/:id/gallery/:index — Remove specific gallery image
router.delete('/:id/gallery/:index', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const index = parseInt(req.params.index);
    if (index < 0 || index >= product.gallery.length) {
      return res.status(400).json({ success: false, error: 'Invalid gallery index' });
    }

    const [removed] = product.gallery.splice(index, 1);
    await destroyAsset(removed.publicId, 'image');
    await product.save();

    res.json({ success: true, message: 'Gallery image removed', data: product });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to remove gallery image' });
  }
});

module.exports = router;