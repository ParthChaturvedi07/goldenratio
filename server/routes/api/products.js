const router = require('express').Router();
const Product = require('../../models/Product');

// GET /api/products — List active products
// Optional query params: ?category=Industrial+Models&sort=price_asc|price_desc
router.get('/', async (req, res) => {
  try {
    const { category, sort } = req.query;

    const filter = { isActive: true };
    if (category) filter.category = category;

    let sortOption = { order: 1, createdAt: -1 };
    if (sort === 'price_asc')  sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };

    const products = await Product.find(filter)
      .sort(sortOption)
      .lean();

    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    console.error('Fetch products error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

// GET /api/products/:slug — Get single active product by slug
router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true }).lean();
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
});

module.exports = router;