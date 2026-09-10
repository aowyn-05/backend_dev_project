# P01 — Enterprise E-Commerce Catalog & Order Management System

> **Course:** Advanced JavaScript Backend Frameworks (Node.js & Express JS)  
> **Course Code:** `BTOE561T5P` | **Batch:** 1 | **Class:** 5 BTAIML  
> **Department:** Department of Artificial Intelligence and Machine Learning (ADSE)  
> **Institution:** School of Engineering and Technology, Christ (Deemed to be University), Bangalore  
> **Submission Date:** September 12, 2026  
> **Repository:** [https://github.com/aowyn-05/backend_dev_project](https://github.com/aowyn-05/backend_dev_project)

---

## Project Team Members & Contributions

| Sl. | Student Name | Roll No. / Reg No. | Department | Class & Section | Primary Module Ownership & Responsibilities |
| :---: | :--- | :---: | :---: | :---: | :--- |
| 1 | **Adhira Praveen** | 2463003 | ADSE | 5 BTAIML | System Architecture, Module 1 (Auth), Module 2 (RBAC), Module 10 (Coupon Engine), Centralized Error Handling (`errorHandler.js`), JSON Syntax Error Guard |
| 2 | **Agnes Mariya S** | 2463004 | ADSE | 5 BTAIML | Module 3 (Product Catalog CRUD), Module 4 (Category Hierarchy), Module 5 (Product Search & Filters), Module 12 (Verified Reviews & Ratings Aggregation), Postman Collection Authoring |
| 3 | **Alvin Jobi** | 2463005 | ADSE | 5 BTAIML | Module 6 (Shopping Cart & Live Stock), Module 7 (Order Placement & Snapshots), Module 8 (Status State Machine), Module 9 (Inventory Decrement), Module 11 (Payment Status Tracking) |
| 4 | **A Vivek Vadakkan** | 2463076 | ADSE | 5 BTAIML | Module 13 (Seller Dashboard & Alerts), Module 14 (Admin Analytics & Approvals), Schema Validation Chains (`express-validator`), Frontend SPA Client Layer (`frontend/`), Seed Data (`seed.js`) |

---

## Project Overview

**P01 — Enterprise E-Commerce Catalog & Order Management System** is a production-grade, multi-vendor RESTful backend service engineered using **Node.js**, **Express.js**, and **MongoDB Atlas** (via **Mongoose ODM**). 

The platform supports three distinct human actors—**Customers**, **Third-Party Sellers**, and **Platform Administrators**—providing secure authentication, full-text catalog search, stock-aware shopping carts, atomic inventory manipulation, finite-state order lifecycles, promotional discounting, verified customer reviews, and analytical dashboards.

---

## Implemented Functional Modules (14/14 Modules)

1. **User Registration & Authentication:** Email normalization, min 8-character password constraint, `bcryptjs` 12-round hashing, duplicate email detection, and 7-day signed JWT issuance.
2. **Role-Based Access Control (RBAC):** Middleware-level authorization (`protect`, `authorize`) governing Customer, Seller, and Admin roles with mandatory unapproved seller gating (`SELLER_NOT_APPROVED`).
3. **Product Catalog Management:** Full CRUD operations for approved merchants with seller-ownership validation (`findOwned`) preventing unauthorized cross-vendor modifications.
4. **Category & Sub-Category Management:** Hierarchical taxonomy utilizing self-referencing Mongoose schemas (`parentCategoryId`) with administrative lifecycle management.
5. **Product Search & Filtering:** Full-text keyword search via MongoDB text index on `{ name, description }`, multi-attribute filtering (category, price range, minimum rating), and server-side pagination.
6. **Shopping Cart Management:** Customer-restricted persistent cart with live inventory verification preventing quantities exceeding live warehouse stock (`INSUFFICIENT_STOCK`).
7. **Order Placement & Checkout:** Snapshotting immutable item details (price, name, seller ID, quantity) into orders at checkout, clearing carts, and calculating totals server-side.
8. **Order Status Workflow:** Deterministic Finite State Machine (`Placed` $\rightarrow$ `Confirmed` $\rightarrow$ `Shipped` $\rightarrow$ `Delivered`, with terminal `Cancelled`), disallowing invalid transitions.
9. **Inventory & Stock Management:** Atomic stock decrement during order confirmation using MongoDB `$inc`, coupled with merchant low-stock alerting (`stock <= 5`).
10. **Discount & Coupon Engine:** Uppercase unique promotional codes supporting percentage and flat discounts, expiration validation, and minimum order threshold enforcement.
11. **Payment Status Tracking:** Simulated payment lifecycle tracking (`Pending`, `Paid`, `Failed`) accepted during checkout without third-party gateway dependencies.
12. **Reviews & Ratings:** Verified purchase gating (`Order.exists({ status: 'Delivered' })`), compound unique index preventing duplicate reviews, and automated rating recalculation via MongoDB aggregation pipelines.
13. **Seller Dashboard APIs:** Aggregated business metrics for merchants including total listings, low-stock alerts, pending orders, total units sold, and net revenue.
14. **Admin Reporting & Analytics:** Administrative merchant approvals (`isApproved: true`), global sales summaries, top 10 best-selling products, and user registration growth velocity over time.

---

## Setup, Installation & How to Run Guide

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher)
- **MongoDB** (Local Community Server or MongoDB Atlas Cloud Cluster URI)
- **Git** & **npm**
- **Postman** (for automated API collection testing)

### 2. Clone the Repository
```bash
git clone https://github.com/aowyn-05/backend_dev_project.git
cd backend_dev_project
```

### 3. Configure Environment Variables
Copy the `.env.example` template to create your `.env` configuration:
```bash
# On Windows PowerShell / Command Prompt:
copy .env.example .env

# On Linux / macOS:
cp .env.example .env
```

Open `.env` and configure your credentials:
```ini
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_random_jwt_key_here_at_least_32_characters
JWT_EXPIRES_IN=7d
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Seed the Database
Populate the database with initial categories, demo products, and accounts for Admin, Seller, and Customer:
```bash
npm run seed
```

> **Default Seed Credentials (Password for all: `Password123!`):**
> - **Administrator:** `admin@example.com`
> - **Approved Seller:** `seller@example.com`
> - **Customer:** `customer@example.com`

### 6. Start the Backend Server
```bash
# Run with nodemon for development hot-reloading:
npm run dev

# Run standard production server:
npm start
```
The API server will launch on `http://localhost:5000` (or your configured `PORT`) and connect to MongoDB.

### 7. Launch the Demonstration Frontend SPA
Open `frontend/index.html` directly in any web browser, or serve it using VS Code Live Server / static HTTP server:
```bash
# Optional: using npx serve
npx serve frontend -p 3000
```
The frontend automatically interfaces with the REST API at `http://localhost:5000/api`.

---

## Postman API Testing & Automation

The repository includes a comprehensive, production-ready Postman collection (`postman_collection.json`) conforming to the Postman Collection v2.1.0 schema.

1. Open Postman $\rightarrow$ Click **Import** $\rightarrow$ Select `postman_collection.json`.
2. The collection organizes **26 requests** across 5 folders:
   - `Auth` (Registration, Login)
   - `Catalog` (Search, Category Listing, Product CRUD, Reviews)
   - `Categories and Coupons` (Category CRUD, Coupon Creation, Coupon Apply)
   - `Cart and Orders` (Cart CRUD, Order Placement, Tracking, Status Updates)
   - `Dashboards and Reports` (Seller Metrics, Seller Approval, Sales Analytics, User Growth)
3. Execute `POST /api/auth/login` with your credentials. Copy the returned JWT token and assign it to the collection's `{{token}}` variable to automatically authenticate subsequent requests.

---

## Complete RESTful API Endpoint Reference (26 Endpoints)

| Method | Endpoint URL | Module / Scope | Access Level | Description | Status Code |
| :---: | :--- | :--- | :---: | :--- | :---: |
| **POST** | `/api/auth/register` | 1. Auth | Public | Register customer or seller account | `201 Created` |
| **POST** | `/api/auth/login` | 1. Auth | Public | Authenticate user & issue signed JWT | `200 OK` |
| **GET** | `/api/products` | 5. Search | Public | Search/filter catalog with pagination | `200 OK` |
| **GET** | `/api/products/:id` | 3. Catalog | Public | Fetch product details by ObjectId | `200 OK` |
| **POST** | `/api/products` | 3. Catalog | Seller (Approved) | Create new merchant catalog listing | `201 Created` |
| **PUT** | `/api/products/:id` | 3. Catalog | Seller (Owner) / Admin | Update owned product details | `200 OK` |
| **DELETE** | `/api/products/:id` | 3. Catalog | Seller (Owner) / Admin | Delete owned product listing | `200 OK` |
| **GET** | `/api/products/:id/reviews` | 12. Reviews | Public | List all customer reviews for product | `200 OK` |
| **POST** | `/api/products/:id/reviews` | 12. Reviews | Customer (Verified) | Submit review on delivered purchase | `201 Created` |
| **GET** | `/api/categories` | 4. Categories | Public | List hierarchical category tree | `200 OK` |
| **POST** | `/api/categories` | 4. Categories | Admin | Create root or sub-category | `201 Created` |
| **PUT** | `/api/categories/:id` | 4. Categories | Admin | Update category details | `200 OK` |
| **DELETE** | `/api/categories/:id` | 4. Categories | Admin | Remove category record | `200 OK` |
| **GET** | `/api/cart` | 6. Cart | Customer | Retrieve customer shopping cart | `200 OK` |
| **POST** | `/api/cart` | 6. Cart | Customer | Add product to cart (stock-checked) | `201 Created` |
| **PUT** | `/api/cart/:itemId` | 6. Cart | Customer | Update cart item quantity | `200 OK` |
| **DELETE** | `/api/cart/:itemId` | 6. Cart | Customer | Remove line item from cart | `200 OK` |
| **POST** | `/api/orders` | 7. Orders | Customer | Convert cart to placed order snapshot | `201 Created` |
| **GET** | `/api/orders/my` | 7. Orders | Customer | Retrieve personal order history | `200 OK` |
| **GET** | `/api/orders/:id` | 7. Orders | Customer / Admin | Inspect detailed order receipt | `200 OK` |
| **PUT** | `/api/orders/:id/status` | 8. Workflow | Seller (Owner) / Admin | Advance order finite state machine | `200 OK` |
| **POST** | `/api/coupons/apply` | 10. Coupons | Customer | Apply discount code on order total | `200 OK` |
| **POST** | `/api/coupons` | 10. Coupons | Admin | Create promotional coupon rule | `201 Created` |
| **GET** | `/api/seller/dashboard` | 13. Seller | Seller (Approved) | Operational stock & revenue metrics | `200 OK` |
| **PUT** | `/api/admin/sellers/:id/approve` | 14. Admin | Admin | Approve pending seller registration | `200 OK` |
| **GET** | `/api/admin/reports/sales` | 14. Admin | Admin | Executive platform sales summary | `200 OK` |
| **GET** | `/api/admin/reports/users` | 14. Admin | Admin | Daily user registration velocity | `200 OK` |

---

## Project Architecture & Directory Layout

```
backend_dev_project/
├── config/
│   └── db.js                 # MongoDB connection manager via Mongoose
├── controllers/
│   ├── adminController.js    # Merchant approvals, order audits, sales & user growth reports
│   ├── authController.js     # User registration, bcrypt hashing, JWT issuance
│   ├── cartController.js     # Persistent cart management & live stock validation
│   ├── categoryController.js # Hierarchical category tree management
│   ├── couponController.js   # Coupon creation & discount calculation engine
│   ├── orderController.js    # Checkout snapshots, atomic stock decrements, state machine
│   ├── productController.js  # Product CRUD, ownership checks, search, review submissions
│   ├── reviewController.js   # Product review retrieval & population
│   └── sellerController.js   # Merchant dashboard analytics & low-stock triggers
├── frontend/
│   ├── css/style.css         # Clean, responsive CSS styling for client views
│   ├── js/api.js             # Client API wrapper, auth state, & dynamic navbar
│   ├── admin.html            # Admin dashboard, category management, & sales reports
│   ├── cart.html             # Customer shopping cart & checkout navigation
│   ├── catalog.html          # Product catalog with search & multi-attribute filters
│   ├── checkout.html         # Order checkout, shipping address, & coupon application
│   ├── index.html            # Landing page with customer/seller registration & login
│   ├── orders.html           # Customer order tracking & historical receipt view
│   ├── product.html          # Product detail view, review submission, & cart addition
│   └── seller.html           # Seller dashboard, product CRUD, & low-stock monitoring
├── middleware/
│   ├── auth.js               # JWT verification, RBAC authorization, seller approval gate
│   ├── errorHandler.js       # Centralized error handler mapping domain error codes
│   └── validate.js           # express-validator error extraction middleware
├── models/
│   ├── Cart.js               # Customer cart schema with embedded line items
│   ├── Category.js           # Self-referencing category hierarchy model
│   ├── Coupon.js             # Promotional discount coupon model
│   ├── Order.js              # Order schema with immutable price snapshots
│   ├── Product.js            # Product catalog model with text index & ratingAvg
│   ├── Review.js             # Product review model with compound unique index
│   └── User.js               # User authentication model with roles & approval flag
├── routes/
│   ├── adminRoutes.js        # Protected administrative endpoints
│   ├── authRoutes.js         # Public authentication endpoints
│   ├── cartRoutes.js         # Customer cart manipulation endpoints
│   ├── categoryRoutes.js     # Public read & admin write category endpoints
│   ├── couponRoutes.js       # Customer apply & admin create coupon endpoints
│   ├── orderRoutes.js        # Customer order creation & seller status updates
│   ├── productRoutes.js      # Catalog search, seller product CRUD, & review routes
│   └── sellerRoutes.js       # Protected merchant dashboard routes
├── utils/
│   ├── asyncHandler.js       # Higher-order async exception wrapper
│   ├── pagination.js         # Standardized page/limit/skip calculation utility
│   └── token.js              # JSON Web Token generator with expiration
├── .env.example              # Template environment configuration file
├── package.json              # Project dependencies and npm scripts
├── postman_collection.json   # 26-request automated API testing collection
├── README.md                 # Project README documentation
├── seed.js                   # Database seeding script for admin, seller, customer, and products
└── server.js                 # Application entry point, middleware assembly, & HTTP listener
```

---

## Security & Defensive Engineering Highlights

- **Bcrypt Password Encryption:** Passwords hashed with `bcryptjs` using 12 salt rounds; plaintext is never stored or leaked.
- **Stateless Bearer JWTs:** Authenticated requests verified via `Authorization: Bearer <token>`, omitting `passwordHash` on user retrieval.
- **Unapproved Merchant Gating:** Newly registered sellers default to `isApproved: false` and are blocked from catalog modifications with `403 SELLER_NOT_APPROVED` until approved by an administrator.
- **Atomic Stock Protection:** Uses atomic updates (`findOneAndUpdate` with `$inc`) during order status confirmation to prevent overselling under high concurrency.
- **Immutable Historical Snapshots:** Line items in orders record name, price, seller ID, and quantity at the time of purchase, insulating historical orders from subsequent vendor price changes.
- **Verified-Buyer Review Integrity:** Verified via `Order.exists({ status: 'Delivered' })` with compound unique index `{ productId: 1, userId: 1 }` preventing fraudulent and duplicate feedback.
- **Centralized Error Standardization:** Maps all Mongoose validation errors, MongoDB duplicate keys, and syntax errors into consistent `{ success: false, message, errorCode }` structures.

---

## Academic Project Metadata
- **Institution:** Christ (Deemed to be University), Bangalore
- **Department:** Department of Artificial Intelligence and Machine Learning (ADSE)
- **Class / Section:** 5 BTAIML (Batch 1)
- **Assessment:** Continuous Internal Assessment (CIA-3)
- **Official Submission Date:** September 12, 2026
