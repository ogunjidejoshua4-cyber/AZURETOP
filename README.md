# VoltCart — Modern Full-Stack E-Commerce Platform

VoltCart is a professional, secure, production-ready full-stack e-commerce platform built from scratch using **Node.js, Express.js, MongoDB, Mongoose, and Vanilla JavaScript**. 

The platform features a dual-frontend architecture connected to a shared backend API, offering a seamless customer shopping experience alongside a powerful administrative dashboard (Admin Studio).

---

## 🚀 Key Features

### 🛍️ Customer-Facing Website (`frontend/`)
- **Product Catalog & Discovery:** Dynamic product listing with real-time search and category filtering.
- **Product Details:** High-resolution image view, stock availability check, and quantity selection.
- **Shopping Cart & Checkout:** Persistent cart management, subtotal calculation, and secure server-validated order placement.
- **Customer Authentication:** Secure email/password registration, login, and JWT-authenticated sessions.
- **Customer Dashboard:** Profile management and full order history tracking with live status updates (`Pending`, `Processing`, `Shipped`, `Delivered`).

### 🛠️ Admin Studio (`admin-studio/`)
- **Secure Admin Portal:** Role-based access control protecting admin endpoints.
- **Dashboard Analytics:** Live statistics tracking total products, total orders, and total revenue.
- **Product & Inventory CRUD:** Create, update, and delete products with integrated Cloudinary image uploads.
- **Category Management:** Create and manage product categories with safety checks preventing deletion of categories containing active products.
- **Order Management:** View incoming store orders and update fulfillment statuses.

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (No frameworks), FontAwesome icons, Plus Jakarta Sans typography.
- **Backend:** Node.js, Express.js, RESTful API architecture, JWT authentication, bcryptjs password hashing, Multer & Streamifier for file uploads.
- **Database & Storage:** MongoDB Atlas (NoSQL database via Mongoose), Cloudinary (Image CDN).
- **Development Tools:** Visual Studio Code, Git, Postman.
- **Deployment:** Render (Backend API), Vercel (Static Frontends), UptimeRobot (Health monitoring).

---

## 📁 Project Folder Structure

```text
MY-ECOMMERCE/
│
├── frontend/                 # Customer-facing website
│   ├── index.html
│   ├── css/ style.css
│   ├── js/ (api.js, app.js, auth.js, cart.js, cart-ui.js, checkout.js, product-detail.js, profile.js, shop.js)
│   └── pages/ (cart.html, checkout.html, login.html, product.html, profile.html, shop.html)
│
├── admin-studio/             # Administrative dashboard
│   ├── index.html
│   ├── css/ admin.css
│   └── js/ admin.js
│
├── backend/                  # Shared Express.js API
│   ├── src/
│   │   ├── config/ (db.js)
│   │   ├── controllers/ (auth, category, order, product, upload)
│   │   ├── middleware/ (authMiddleware, uploadMiddleware)
│   │   ├── models/ (User, Category, Product, Order)
│   │   ├── routes/ (auth, category, order, product, upload)
│   │   ├── utils/ (cloudinary, generateToken, seedAdmin)
│   │   └── server.js
│   ├── .env
│   └── package.json
│
└── README.md