const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Business = require('../models/Business');
const { isLoggedIn, isVendor } = require('../middleware/auth');

// Add product
router.post('/', isLoggedIn, isVendor, async (req, res) => {
  try {
    const { name, description, price, stock, category, image } = req.body;
    const business = await Business.findOne({ vendor: req.session.userId });
    if (!business) return res.status(400).json({ message: 'Create a business first' });
    const product = await Product.create({ business: business._id, vendor: req.session.userId, name, description, price, stock, category, image });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    const products = await Product.find(query).populate('business', 'name').populate('vendor', 'name');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get vendor's products
router.get('/mine', isLoggedIn, isVendor, async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.session.userId }).populate('business', 'name');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('business', 'name address phone').populate('vendor', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update product
router.put('/:id', isLoggedIn, isVendor, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, vendor: req.session.userId },
      req.body,
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete product
router.delete('/:id', isLoggedIn, isVendor, async (req, res) => {
  try {
    await Product.findOneAndDelete({ _id: req.params.id, vendor: req.session.userId });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
