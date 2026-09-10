const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.create = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    if (!cart || !cart.items.length) return res.status(400).json({ success: false, message: 'Cart is empty', errorCode: 'EMPTY_CART' });
    const items = []; let total = 0;
    for (const item of cart.items) { if (!item.productId || item.quantity > item.productId.stock) return res.status(409).json({ success: false, message: `Insufficient stock for ${item.productId?.name || 'product'}`, errorCode: 'INSUFFICIENT_STOCK' }); items.push({ productId: item.productId._id, name: item.productId.name, price: item.productId.price, qty: item.quantity, sellerId: item.productId.sellerId }); total += item.productId.price * item.quantity; }
    const order = await Order.create({ userId: req.user._id, items, totalAmount: total, shippingAddress: req.body.shippingAddress, paymentStatus: req.body.paymentStatus || 'Pending' });
    cart.items = []; await cart.save(); res.status(201).json({ success: true, data: order });
  } catch (error) { next(error); }
};
exports.get = async (req, res, next) => { try { const order = await Order.findById(req.params.id).populate('items.productId', 'name'); if (!order) return res.status(404).json({ success: false, message: 'Order not found', errorCode: 'NOT_FOUND' }); if (req.user.role === 'customer' && order.userId.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'You can only view your own orders', errorCode: 'FORBIDDEN' }); res.json({ success: true, data: order }); } catch (error) { next(error); } };
exports.mine = async (req, res, next) => { try { const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 }); res.json({ success: true, data: orders }); } catch (error) { next(error); } };
exports.status = async (req, res, next) => {
  try { const order = await Order.findById(req.params.id); if (!order) return res.status(404).json({ success: false, message: 'Order not found', errorCode: 'NOT_FOUND' }); const ownsItem = order.items.some((item) => item.sellerId?.toString() === req.user._id.toString()); if (req.user.role === 'seller' && !ownsItem) return res.status(403).json({ success: false, message: 'Seller does not own items in this order', errorCode: 'FORBIDDEN' }); const transitions = { Placed: ['Confirmed', 'Cancelled'], Confirmed: ['Shipped', 'Cancelled'], Shipped: ['Delivered'], Delivered: [], Cancelled: [] }; const nextStatus = req.body.status; if (!transitions[order.status].includes(nextStatus)) return res.status(400).json({ success: false, message: `Invalid transition from ${order.status} to ${nextStatus}`, errorCode: 'INVALID_STATUS_TRANSITION' }); if (nextStatus === 'Confirmed') { for (const item of order.items) { const updated = await Product.findOneAndUpdate({ _id: item.productId, stock: { $gte: item.qty } }, { $inc: { stock: -item.qty } }, { new: true }); if (!updated) return res.status(409).json({ success: false, message: 'Stock changed; order cannot be confirmed', errorCode: 'INSUFFICIENT_STOCK' }); } } order.status = nextStatus; await order.save(); res.json({ success: true, data: order }); } catch (error) { next(error); }
};
