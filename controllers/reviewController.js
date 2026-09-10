const Review = require('../models/Review');
exports.list = async (req, res, next) => { try { const reviews = await Review.find({ productId: req.params.id }).populate('userId', 'name').sort({ createdAt: -1 }); res.json({ success: true, data: reviews }); } catch (error) { next(error); } };
