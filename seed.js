require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

const seed = async () => {
  await connectDB();
  await Promise.all([User.deleteMany({}), Category.deleteMany({}), Product.deleteMany({})]);
  const passwordHash = await bcrypt.hash('Password123!', 12);
  const [admin, seller, customer] = await User.create([
    { name: 'Demo Admin', email: 'admin@example.com', passwordHash, role: 'admin' },
    { name: 'Demo Seller', email: 'seller@example.com', passwordHash, role: 'seller' },
    { name: 'Demo Customer', email: 'customer@example.com', passwordHash, role: 'customer', address: '1 Demo Street' }
  ]);
  const electronics = await Category.create({ name: 'Electronics' });
  await Product.create([
    { name: 'Wireless Headphones', description: 'Noise cancelling headphones', price: 99.99, categoryId: electronics._id, sellerId: seller._id, stock: 25 },
    { name: 'USB-C Hub', description: 'Seven port USB-C hub', price: 39.99, categoryId: electronics._id, sellerId: seller._id, stock: 4 }
  ]);
  console.log(`Seeded admin ${admin.email}, seller ${seller.email}, customer ${customer.email}`);
  process.exit(0);
};
seed().catch((error) => { console.error(error); process.exit(1); });
