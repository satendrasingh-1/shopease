const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password, role: role || 'buyer' });
    req.session.userId = user._id;
    req.session.role = user.role;
    req.session.name = user.name;
    res.json({ message: 'Registered successfully', role: user.role, name: user.name });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(400).json({ message: 'Invalid email or password' });
    req.session.userId = user._id;
    req.session.role = user.role;
    req.session.name = user.name;
    res.json({ message: 'Login successful', role: user.role, name: user.name });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out' });
});

// Me
router.get('/me', (req, res) => {
  if (req.session.userId) {
    res.json({ loggedIn: true, role: req.session.role, name: req.session.name, id: req.session.userId });
  } else {
    res.json({ loggedIn: false });
  }
});

module.exports = router;
