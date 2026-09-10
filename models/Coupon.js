const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType: { type: String, enum: ['percent', 'flat'], required: true },
  value: { type: Number, required: true, min: 0 },
  validTill: { type: Date, required: true },
  minOrderValue: { type: Number, default: 0, min: 0 }
}, { timestamps: true });
module.exports = mongoose.model('Coupon', couponSchema);
