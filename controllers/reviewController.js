const Review = require('../models/Review');
const Product = require('../models/Product');
exports.list = async (req, res, next) => { try { const product = await Product.findById(req.params.id); if (!product) return res.status(404).json({ success: false, message: 'Product not found', errorCode: 'NOT_FOUND' }); const reviews = await Review.find({ productId: product._id }).populate('userId', 'name').sort({ createdAt: -1 }); res.json({ success: true, data: reviews }); } catch (error) { next(error); } };
