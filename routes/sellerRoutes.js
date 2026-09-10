const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const controller = require('../controllers/sellerController');
router.get('/dashboard', protect, authorize('seller'), controller.dashboard);
module.exports = router;
