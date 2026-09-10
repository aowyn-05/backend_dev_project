require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use((error, req, res, next) => { if (error instanceof SyntaxError && error.status === 400 && error.type === 'entity.parse.failed') return res.status(400).json({ success: false, message: 'Malformed JSON body', errorCode: 'VALIDATION_ERROR' }); next(error); });
app.get('/health', (req, res) => res.json({ success: true, message: 'API is healthy' }));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/seller', require('./routes/sellerRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found', errorCode: 'NOT_FOUND' }));
app.use(errorHandler);

if (require.main === module) {
  connectDB().then(() => app.listen(process.env.PORT || 5000, () => console.log(`API listening on port ${process.env.PORT || 5000}`))).catch((error) => { console.error(error.message); process.exit(1); });
}
module.exports = app;
