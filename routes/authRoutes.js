const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const controller = require('../controllers/authController');
const password = body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters');
router.post('/register', [body('name').trim().isLength({ min: 2 }), body('email').isEmail().normalizeEmail(), password, body('role').optional().isIn(['customer', 'seller']), body('address').optional().isString(), validate], controller.register);
router.post('/login', [body('email').isEmail().normalizeEmail(), body('password').isString().notEmpty(), validate], controller.login);
module.exports = router;
