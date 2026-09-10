const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/token');

const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role, address: user.address });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, address } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ success: false, message: 'Email is already registered', errorCode: 'DUPLICATE_EMAIL' });
    const selectedRole = role || 'customer';
    const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12), role: selectedRole, isApproved: selectedRole !== 'seller', address });
    res.status(201).json({ success: true, data: { user: publicUser(user), token: generateToken(user) } });
  } catch (error) { next(error); }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.passwordHash))) return res.status(401).json({ success: false, message: 'Invalid email or password', errorCode: 'INVALID_CREDENTIALS' });
    res.json({ success: true, data: { user: publicUser(user), token: generateToken(user) } });
  } catch (error) { next(error); }
};
