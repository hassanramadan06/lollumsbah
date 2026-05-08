# Little Stars — Kids Clothing Store 🧸

A complete, production-quality e-commerce application for selling kids clothing (ages 1–10).

**Stack**
- **Frontend:** HTML5 + CSS3 + Vanilla JavaScript (no build step)
- **Backend:** Node.js + Express + Sequelize
- **Database:** MySQL 8
- **Auth:** JWT with role-based access (admin / customer)

---

## ✨ Features

### Customer-facing
- Professional home page with hero banner, new arrivals, best sellers, special offers
- Shop by age group (1–3, 4–6, 7–10)
- Products grid with filters: age, gender (boy/girl/unisex), size, color, price, search, sorting
- Rich product detail page: gallery, size & color pickers, quantity, reviews
- Cart (works for both guests and logged-in users, with server sync on login)
- Checkout with coupons, payment method, shipping details
- Authentication (register/login), account profile
- Wishlist
- My Orders page with order tracking
- Product reviews & ratings
- About, Contact pages
- Responsive design (mobile, tablet, desktop)
- SEO-friendly meta tags, clean URLs

### Admin dashboard
- Secure admin login
- Sales dashboard with stats (users, products, orders, revenue, pending)
- Daily sales chart (last 30 days)
- Top-selling products report
- Full product CRUD with image uploads, variants (size × color × stock)
- Categories CRUD
- Orders management with status updates
- Customers management (enable/disable accounts)
- Coupons management (percent or fixed, min order, expiry, usage limit)

### Security
- Bcrypt password hashing
- JWT authentication
- Helmet security headers with tailored CSP
- Rate limiting on `/api`
- Role-based authorization (admin-only endpoints)
- CORS properly configured

---

## 🚀 Quick start

### Prerequisites
- Node.js 18+ and npm
- MySQL 8 (or Docker)

### 1) Start MySQL

**Option A — using Docker (recommended):**
```bash
docker run -d --name kids_mysql \
  -e MYSQL_ROOT_PASSWORD=rootpw \
  -e MYSQL_DATABASE=kids_clothing_store \
  -p 3306:3306 \
  mysql:8.0
```

**Option B — use your existing MySQL server.** Create a database:
```sql
CREATE DATABASE kids_clothing_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2) Configure environment

```bash
cd backend
cp .env.example .env
# Edit .env and set DB_PASSWORD (and any other values you want to change)
```

Default values in `.env.example`:
```
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=kids_clothing_store
DB_USER=root
DB_PASSWORD=your_mysql_password

JWT_SECRET=change_this_to_a_long_random_secret_in_production
ADMIN_EMAIL=admin@kidsstore.com
ADMIN_PASSWORD=Admin@12345
```

### 3) Install dependencies & seed the database

```bash
cd backend
npm install
npm run seed   # creates tables, admin account, 30 demo products, coupons
```

You should see:
```
[SEED] Admin created: admin@kidsstore.com / Admin@12345
[SEED] Customer created: customer@kidsstore.com / Customer@123
[SEED] 30 products created.
[SEED] Coupons created: WELCOME10, SAVE20, FLAT5
```

### 4) Start the server

```bash
cd backend
npm start       # or: npm run dev   (auto-reload with nodemon)
```

The backend **automatically serves the frontend** on the same port. Open:
- **Storefront:** http://localhost:5000
- **Admin panel:** http://localhost:5000/admin/login.html
- **REST API:** http://localhost:5000/api

---

## 🔑 Demo accounts

| Role      | Email                       | Password      |
|-----------|-----------------------------|---------------|
| Admin     | `admin@kidsstore.com`       | `Admin@12345` |
| Customer  | `customer@kidsstore.com`    | `Customer@123`|

## 🎟️ Demo coupons

| Code       | Type     | Value   | Min order |
|------------|----------|---------|-----------|
| `WELCOME10`| Percent  | 10% off | $0        |
| `SAVE20`   | Percent  | 20% off | $100      |
| `FLAT5`    | Fixed    | $5 off  | $30       |

---

## 📁 Project structure

```
kids-clothing-store/
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection
│   │   ├── models/          # Sequelize models
│   │   ├── controllers/     # Business logic
│   │   ├── routes/          # Express routes
│   │   ├── middlewares/     # auth, error, upload
│   │   ├── utils/           # helpers (slugify)
│   │   ├── seed/            # DB seed & sync scripts
│   │   └── server.js        # Entry point
│   ├── uploads/             # Uploaded product images
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── css/style.css        # Main stylesheet
    ├── js/
    │   ├── config.js        # API URL configuration
    │   ├── api.js           # API client
    │   ├── ui.js            # Header, footer, toasts
    │   └── product-card.js  # Product card template
    ├── pages/
    │   ├── products.html    # Shop page with filters
    │   ├── product.html     # Product detail
    │   ├── cart.html
    │   ├── checkout.html
    │   ├── order-success.html
    │   ├── login.html
    │   ├── register.html
    │   ├── account.html
    │   ├── orders.html
    │   ├── wishlist.html
    │   ├── about.html
    │   └── contact.html
    ├── admin/
    │   ├── css/admin.css
    │   ├── js/admin-ui.js
    │   ├── login.html
    │   ├── index.html       # Dashboard
    │   └── pages/
    │       ├── products.html
    │       ├── categories.html
    │       ├── orders.html
    │       ├── customers.html
    │       ├── coupons.html
    │       └── reports.html
    └── index.html           # Home page
```

---

## 🧩 REST API

All endpoints are prefixed with `/api`.

### Auth
| Method | Path                 | Auth   | Description           |
|--------|----------------------|--------|-----------------------|
| POST   | `/auth/register`     | Public | Register new user     |
| POST   | `/auth/login`        | Public | Login                 |
| GET    | `/auth/me`           | User   | Current profile       |
| PUT    | `/auth/me`           | User   | Update profile        |
| PUT    | `/auth/password`     | User   | Change password       |

### Products & Categories
| Method | Path                  | Auth   | Description                       |
|--------|-----------------------|--------|-----------------------------------|
| GET    | `/products`           | Public | List with filters (see below)     |
| GET    | `/products/:slugOrId` | Public | Product detail                    |
| POST   | `/products`           | Admin  | Create product                    |
| PUT    | `/products/:id`       | Admin  | Update product                    |
| DELETE | `/products/:id`       | Admin  | Delete product                    |
| GET    | `/categories`         | Public | List categories                   |
| POST   | `/categories`         | Admin  | Create                            |
| PUT    | `/categories/:id`     | Admin  | Update                            |
| DELETE | `/categories/:id`     | Admin  | Delete                            |

**Filter query params for `/products`:**
`search`, `category` (slug), `ageGroup` (`1-3`, `4-6`, `7-10`), `gender` (`boy`, `girl`, `unisex`),
`size`, `color`, `minPrice`, `maxPrice`, `sort` (`newest`, `price_asc`, `price_desc`, `rating`),
`featured`, `newOnly`, `bestSeller`, `page`, `pageSize`.

### Cart & Wishlist (user)
| Method | Path                     | Description         |
|--------|--------------------------|---------------------|
| GET    | `/cart`                  | List cart items     |
| POST   | `/cart`                  | Add item            |
| PUT    | `/cart/:id`              | Update quantity     |
| DELETE | `/cart/:id`              | Remove item         |
| DELETE | `/cart`                  | Clear cart          |
| GET    | `/wishlist`              | List wishlist       |
| POST   | `/wishlist`              | Add product         |
| DELETE | `/wishlist/:productId`   | Remove              |

### Orders
| Method | Path                         | Auth    | Description               |
|--------|------------------------------|---------|---------------------------|
| POST   | `/orders/validate-coupon`    | Public  | Validate & compute discount |
| POST   | `/orders/checkout`           | Optional| Place order (guest or user) |
| GET    | `/orders/mine`               | User    | My orders                 |
| GET    | `/orders/:id`                | User    | Single order              |

### Reviews
| Method | Path                          | Auth   | Description          |
|--------|-------------------------------|--------|----------------------|
| GET    | `/reviews/product/:productId` | Public | Reviews for product  |
| POST   | `/reviews/product/:productId` | User   | Add review           |
| DELETE | `/reviews/:id`                | Owner  | Remove               |

### Admin
| Method | Path                          | Description                      |
|--------|-------------------------------|----------------------------------|
| GET    | `/admin/reports`              | Summary + sales chart + top      |
| GET    | `/admin/orders`               | List all orders                  |
| PUT    | `/admin/orders/:id/status`    | Update order status              |
| GET    | `/admin/users`                | List users                       |
| PUT    | `/admin/users/:id/toggle`     | Enable/disable user              |
| GET    | `/coupons`                    | List coupons                     |
| POST   | `/coupons`                    | Create coupon                    |
| PUT    | `/coupons/:id`                | Update                           |
| DELETE | `/coupons/:id`                | Delete                           |
| POST   | `/uploads/single`             | Upload one image                 |
| POST   | `/uploads/multi`              | Upload multiple images           |

**Auth header:** `Authorization: Bearer <jwt_token>`

---

## 🛠️ Development

- **Auto-reload:** `npm run dev` uses `nodemon`.
- **Re-seed DB:** drop tables and re-run seed:
  ```bash
  mysql -uroot -prootpw -h 127.0.0.1 -e "DROP DATABASE kids_clothing_store; CREATE DATABASE kids_clothing_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
  npm run seed
  ```
- **Serve frontend separately:** set `FRONTEND_PATH=none` to disable the backend's built-in static serving, then serve `/frontend` with any static file server (e.g. `npx serve frontend`). Update `localStorage.setItem('API_BASE', 'http://localhost:5000/api')` in the browser console.

---

## 🧪 Test flows

1. **Browse as guest:** home → shop → filter by age 4–6 → open a product → add to cart → cart page → apply `WELCOME10` → checkout.
2. **Register:** `/pages/register.html`, place an order, then `/pages/orders.html` shows it.
3. **Admin:** sign in at `/admin/login.html`, add a product with images, create a coupon, view the dashboard after a couple of orders.

---

## 📝 Notes

- Images used in seed data come from [picsum.photos](https://picsum.photos) as lightweight placeholders.
- `uploads/` is used for admin-uploaded images and is git-ignored.
- For production, at minimum: set a long random `JWT_SECRET`, change admin password, configure a reverse proxy with HTTPS, and point `DB_PASSWORD` to a non-root user with least privileges.

---

## 📄 License

MIT © 2025
