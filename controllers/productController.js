const Product = require('../models/Product');
const Review = require('../models/Review');
const getPagination = require('../utils/pagination');

exports.list = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const filter = {};
    if (req.query.keyword) filter.$text = { $search: req.query.keyword };
    if (req.query.category) filter.categoryId = req.query.category;
    if (req.query.minPrice || req.query.maxPrice) filter.price = { ...(req.query.minPrice ? { $gte: Number(req.query.minPrice) } : {}), ...(req.query.maxPrice ? { $lte: Number(req.query.maxPrice) } : {}) };
    if (req.query.minRating) filter.ratingAvg = { $gte: Number(req.query.minRating) };
    const [products, total] = await Promise.all([Product.find(filter).populate('categoryId', 'name').populate('sellerId', 'name').sort({ createdAt: -1 }).skip(skip).limit(limit), Product.countDocuments(filter)]);
    res.json({ success: true, data: products, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try { const product = await Product.create({ ...req.body, sellerId: req.user._id }); res.status(201).json({ success: true, data: product }); } catch (error) { next(error); }
};

const findOwned = async (id, user) => {
  const product = await Product.findById(id);
  if (!product) return { error: { status: 404, message: 'Product not found', code: 'NOT_FOUND' } };
  if (user.role === 'seller' && product.sellerId.toString() !== user._id.toString()) return { error: { status: 403, message: 'You do not own this product', code: 'FORBIDDEN' } };
  return { product };
};
exports.update = async (req, res, next) => {
  try { const result = await findOwned(req.params.id, req.user); if (result.error) return res.status(result.error.status).json({ success: false, message: result.error.message, errorCode: result.error.code }); Object.assign(result.product, req.body); await result.product.save(); res.json({ success: true, data: result.product }); } catch (error) { next(error); }
};
exports.remove = async (req, res, next) => {
  try { const result = await findOwned(req.params.id, req.user); if (result.error) return res.status(result.error.status).json({ success: false, message: result.error.message, errorCode: result.error.code }); await result.product.deleteOne(); res.json({ success: true, message: 'Product deleted' }); } catch (error) { next(error); }
};
exports.review = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id); if (!product) return res.status(404).json({ success: false, message: 'Product not found', errorCode: 'NOT_FOUND' });
    const Order = require('../models/Order');
    const delivered = await Order.exists({ userId: req.user._id, status: 'Delivered', 'items.productId': product._id });
    if (!delivered) return res.status(400).json({ success: false, message: 'You can review products from delivered orders only', errorCode: 'REVIEW_NOT_ALLOWED' });
    await Review.create({ productId: product._id, userId: req.user._id, ...req.body });
    const stats = await Review.aggregate([{ $match: { productId: product._id } }, { $group: { _id: null, average: { $avg: '$rating' } } }]);
    product.ratingAvg = stats[0]?.average || 0; await product.save();
    res.status(201).json({ success: true, data: { ratingAvg: product.ratingAvg } });
  } catch (error) { next(error); }
};
