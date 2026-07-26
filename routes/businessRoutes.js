const express = require('express');
const router = express.Router();
const Business = require('../models/Business');
const { isLoggedIn, isVendor } = require('../middleware/auth');

// Create business
router.post('/', isLoggedIn, isVendor, async (req, res) => {
  try {
    const { name, description, category, address, phone } = req.body;
    const business = await Business.create({ vendor: req.session.userId, name, description, category, address, phone });
    res.json(business);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my business
router.get('/mine', isLoggedIn, isVendor, async (req, res) => {
  try {
    const business = await Business.findOne({ vendor: req.session.userId });
    res.json(business);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all businesses
router.get('/', async (req, res) => {
  try {
    const businesses = await Business.find().populate('vendor', 'name email');
    res.json(businesses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
