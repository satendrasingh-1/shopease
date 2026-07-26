const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { isLoggedIn, isVendor } = require('../middleware/auth');

// Place order
router.post('/place', isLoggedIn, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    const cart = await Cart.findOne({ user: req.session.userId }).populate('items.product');
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    const items = cart.items.map(i => ({
      product: i.product._id,
      name: i.product.name,
      price: i.product.price,
      quantity: i.quantity
    }));
    const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const order = await Order.create({ user: req.session.userId, items, totalAmount, shippingAddress, paymentMethod });

    // Clear cart after order
    await Cart.findOneAndUpdate({ user: req.session.userId }, { items: [] });

    res.json({ message: 'Order placed successfully', orderId: order._id, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my orders (buyer)
router.get('/mine', isLoggedIn, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.session.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get vendor orders
router.get('/vendor', isLoggedIn, isVendor, async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.session.userId });
    const productIds = products.map(p => p._id.toString());
    const allOrders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    const vendorOrders = allOrders.filter(o => o.items.some(i => productIds.includes(i.product?.toString())));
    res.json(vendorOrders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel order
router.put('/cancel/:id', isLoggedIn, async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, user: req.session.userId, status: 'pending' },
      { status: 'cancelled' },
      { new: true }
    );
    if (!order) return res.status(400).json({ message: 'Cannot cancel this order' });
    res.json({ message: 'Order cancelled', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order status (vendor)
router.put('/status/:id', isLoggedIn, isVendor, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
