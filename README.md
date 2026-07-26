# ShopEase - Full E-Commerce Website

A complete e-commerce application with Vendor & Buyer features.

## Features

### Buyer
- Register/Login as buyer
- Browse & search products
- Add to cart, manage quantities
- Checkout with shipping address
- Choose payment: COD / UPI / Card
- View order history & cancel orders

### Vendor
- Register/Login as vendor
- Create/manage business profile
- Add, edit, delete products with stock
- View all customer orders
- Update order status (pending → confirmed → shipped → delivered)
- Dashboard with revenue stats

## Setup & Run

### Prerequisites
- Node.js (v16+)
- MongoDB running locally (or update MONGO_URI in .env)

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Update .env if needed (MongoDB URI, etc.)

# 3. Start the server
npm start

# Or with auto-reload:
npm run dev
```

### Open in browser
```
http://localhost:3000
```

## Project Structure

```
ecommerce/
├── server.js              # Main Express server
├── .env                   # Environment variables
├── models/
│   ├── User.js
│   ├── Business.js
│   ├── Product.js
│   ├── Cart.js
│   └── Order.js
├── routes/
│   ├── authRoutes.js
│   ├── businessRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   └── orderRoutes.js
├── middleware/
│   └── auth.js
└── public/
    ├── css/style.css
    ├── js/app.js
    └── pages/
        ├── index.html
        ├── login.html
        ├── register.html
        ├── products.html
        ├── cart.html
        ├── checkout.html
        ├── orders.html
        └── vendor.html
```

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| POST | /api/auth/logout | Logout |
| GET | /api/auth/me | Get current user |
| POST | /api/business | Create business (vendor) |
| GET | /api/business/mine | Get my business |
| GET | /api/products | Get all products |
| POST | /api/products | Add product (vendor) |
| PUT | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |
| GET | /api/cart | Get cart |
| POST | /api/cart/add | Add to cart |
| PUT | /api/cart/update | Update quantity |
| DELETE | /api/cart/remove/:id | Remove item |
| POST | /api/orders/place | Place order |
| GET | /api/orders/mine | My orders (buyer) |
| GET | /api/orders/vendor | Vendor orders |
| PUT | /api/orders/cancel/:id | Cancel order |
| PUT | /api/orders/status/:id | Update status (vendor) |
