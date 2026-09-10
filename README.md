# backend_dev_project

## Enterprise E-Commerce API

Backend-only Node.js and Express API using MongoDB/Mongoose, JWT authentication, bcrypt password hashing, express-validator, dotenv, and centralized error handling.

### Setup

1. Install Node.js 18+ and MongoDB.
2. Copy `.env.example` to `.env` and set `MONGO_URI` and a strong `JWT_SECRET`.
3. Run `npm install`.
4. Optionally run `npm run seed` for demo users/products.
5. Run `npm run dev` or `npm start`.

### Modules

1. Registration and JWT authentication
2. Role-based access control
3. Seller-owned product CRUD
4. Hierarchical categories
5. Search, filtering, and pagination
6. Stock-aware cart management
7. Checkout and order summaries
8. Validated order status workflow
9. Inventory decrement and low-stock reporting
10. Coupon validation and discounts
11. Mock payment status tracking
12. Delivered-order reviews and rating averages
13. Seller dashboard
14. Admin sales and user-growth reports

### Endpoint Table

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/products` | Public |
| POST/PUT/DELETE | `/api/products`, `/api/products/:id` | Seller/Admin |
| GET/POST/PUT/DELETE | `/api/categories`, `/api/categories/:id` | Public/Admin |
| GET/POST/PUT/DELETE | `/api/cart`, `/api/cart/:itemId` | Customer |
| POST/GET | `/api/orders`, `/api/orders/my`, `/api/orders/:id` | Customer |
| PUT | `/api/orders/:id/status` | Seller/Admin |
| POST | `/api/coupons/apply` | Customer |
| POST | `/api/coupons` | Admin |
| GET/POST | `/api/products/:id/reviews` | Public/Customer |
| GET | `/api/seller/dashboard` | Seller |
| GET | `/api/admin/reports/sales` | Admin |
| GET | `/api/admin/reports/users` | Admin |
| PUT | `/api/admin/sellers/:id/approve` | Admin |

### Schema Summary

Users, products, categories, carts, orders, coupons, and reviews are modeled in `models/`. Carts and orders embed their line items; products, users, and categories are referenced by ObjectId. Required indexes include unique user email, product category, category parent, cart user, and order user.

### Postman

Import `postman_collection.json`, log in, and set the returned JWT in the collection `token` variable. Replace the sample ObjectId variables with IDs returned by your API.

### Known Limitations

- Payment is intentionally a mock status field; no payment provider is integrated.
- Order confirmation is not wrapped in a MongoDB transaction, so production deployments should use transactions and idempotency keys.
- New seller accounts remain blocked until an admin calls the seller approval endpoint.

