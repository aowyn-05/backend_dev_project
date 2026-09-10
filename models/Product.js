const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stock: { type: Number, required: true, min: 0 },
  images: [{ type: String }],
  ratingAvg: { type: Number, min: 0, max: 5, default: 0 }
}, { timestamps: true });
productSchema.index({ categoryId: 1 });
productSchema.index({ name: 'text', description: 'text' });
module.exports = mongoose.model('Product', productSchema);
