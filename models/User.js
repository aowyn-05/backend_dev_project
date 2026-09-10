const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['customer', 'seller', 'admin'], default: 'customer' },
  isApproved: { type: Boolean, default: false },
  address: { type: String, trim: true, default: '' }
}, { timestamps: { createdAt: true, updatedAt: false } });

module.exports = mongoose.model('User', userSchema);
