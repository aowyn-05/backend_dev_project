const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, name: String, price: Number, qty: Number, sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
  totalAmount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['Placed', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'], default: 'Placed' },
  shippingAddress: { type: String, required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
  couponCode: String,
  discountAmount: { type: Number, default: 0 }
}, { timestamps: { createdAt: true, updatedAt: true } });
orderSchema.index({ userId: 1 });
module.exports = mongoose.model('Order', orderSchema);
