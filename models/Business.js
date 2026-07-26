const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  address: { type: String },
  phone: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Business', businessSchema);
