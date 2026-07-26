const isLoggedIn = (req, res, next) => {
  if (req.session && req.session.userId) return next();
  return res.status(401).json({ message: 'Please login first' });
};

const isVendor = (req, res, next) => {
  if (req.session && req.session.role === 'vendor') return next();
  return res.status(403).json({ message: 'Vendor access only' });
};

module.exports = { isLoggedIn, isVendor };
