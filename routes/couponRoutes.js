const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const Coupon = require('../models/Coupon');
const controller = require('../controllers/couponController');
router.post('/apply', protect, authorize('customer'), [body('code').trim().isLength({ min: 2 }), body('orderValue').isFloat({ min: 0 }), validate], controller.apply);
router.post('/', protect, authorize('admin'), [body('code').trim().isLength({ min: 2 }), body('discountType').isIn(['percent', 'flat']), body('value').isFloat({ min: 0 }), body('validTill').isISO8601(), body('minOrderValue').optional().isFloat({ min: 0 }), validate], async (req, res, next) => { try { const coupon = await Coupon.create(req.body); res.status(201).json({ success: true, data: coupon }); } catch (error) { next(error); } });
module.exports = router;
