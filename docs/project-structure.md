# Struktur Proyek E-Commerce KWU BEM

## Frontend (React + Vite)
```
frontend/
├── public/
│   ├── vite.svg
│   ├── favicon.ico
│   └── images/
│       ├── products/
│       ├── banners/
│       └── logos/
├── src/
│   ├── main.jsx                 # Entry point aplikasi
│   ├── App.jsx                  # Komponen utama
│   ├── index.css               # Global styles
│   ├── assets/                 # Asset statis
│   │   ├── fonts/
│   │   │   ├── AtemicaSans_PERSONAL_USE_ONLY.otf
│   │   │   ├── couture-bld.otf
│   │   │   ├── CreatoDisplay-Bold.otf
│   │   │   ├── CreatoDisplay-Light.otf
│   │   │   ├── CreatoDisplay-Medium.otf
│   │   │   ├── Mayeka Bold Demo.otf
│   │   │   └── Milligram-Macro-Regular-trial.ttf
│   │   ├── icons/
│   │   │   ├── arrow-return-svgrepo-com.svg
│   │   │   ├── menu.png
│   │   │   ├── profile-1341-svgrepo-com.svg
│   │   │   └── shopping-bag-svgrepo-com.svg
│   │   ├── img/
│   │   │   ├── KWU LOGO.svg
│   │   │   ├── ospek_kit.png
│   │   │   ├── surreal-tshirt-mockup.jpg
│   │   │   ├── Tote-Bag-Mockup-1-1536x1152.jpg
│   │   │   └── tshirtmockup.avif
│   │   └── assets.js
│   ├── components/             # Komponen reusable
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── Modal.jsx
│   │   ├── ui/
│   │   │   ├── 3d-card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   └── Badge.jsx
│   │   ├── product/
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── ProductGrid3d.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   └── ProductFilter.jsx
│   │   ├── cart/
│   │   │   ├── CartItem.jsx
│   │   │   ├── CartSummary.jsx
│   │   │   └── CartDrawer.jsx
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   └── admin/
│   │       ├── Dashboard.jsx
│   │       ├── ProductManager.jsx
│   │       ├── OrderManager.jsx
│   │       └── UserManager.jsx
│   ├── pages/                  # Halaman utama
│   │   ├── Home.jsx
│   │   ├── Catalog.jsx
│   │   ├── Product.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Payment.jsx
│   │   ├── Orders.jsx
│   │   ├── Contact.jsx
│   │   ├── Login.jsx
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── ProductManagement.jsx
│   │       └── OrderManagement.jsx
│   ├── context/               # State management
│   │   ├── ShopContext.jsx
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── hooks/                 # Custom hooks
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   ├── useProducts.js
│   │   └── useOrders.js
│   ├── services/              # API calls
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── productService.js
│   │   ├── cartService.js
│   │   └── orderService.js
│   ├── utils/                 # Utility functions
│   │   ├── cn.js
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   └── constants.js
│   └── styles/               # CSS modules/styled components
│       ├── components/
│       ├── pages/
│       └── globals.css
├── .env                      # Environment variables
├── .env.example
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── vite.config.js
└── tailwind.config.js        # Jika menggunakan Tailwind
```

## Backend (Node.js + Express)
```
backend/
├── src/
│   ├── app.js                # Entry point aplikasi
│   ├── server.js             # Server configuration
│   ├── config/               # Konfigurasi
│   │   ├── database.js
│   │   ├── cloudinary.js
│   │   ├── jwt.js
│   │   └── multer.js
│   ├── controllers/          # Business logic
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── adminController.js
│   ├── middleware/           # Middleware functions
│   │   ├── auth.js
│   │   ├── admin.js
│   │   ├── validation.js
│   │   ├── errorHandler.js
│   │   └── upload.js
│   ├── models/               # Database models
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   └── Category.js
│   ├── routes/               # API routes
│   │   ├── index.js
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   └── admin.js
│   ├── services/             # Business services
│   │   ├── authService.js
│   │   ├── emailService.js
│   │   ├── paymentService.js
│   │   └── uploadService.js
│   ├── utils/                # Utility functions
│   │   ├── helpers.js
│   │   ├── validators.js
│   │   ├── constants.js
│   │   └── logger.js
│   └── database/             # Database related
│       ├── migrations/
│       ├── seeders/
│       └── connection.js
├── uploads/                  # File uploads
│   ├── products/
│   └── temp/
├── tests/                    # Test files
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── docs/                     # Documentation
│   ├── api.md
│   └── setup.md
├── .env                      # Environment variables
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── nodemon.json
```

## Root Project Structure
```
e-commerce-kwu-bem/
├── frontend/                 # React frontend
├── backend/                  # Node.js backend
├── shared/                   # Shared utilities/types
│   ├── constants.js
│   ├── types.js
│   └── utils.js
├── docs/                     # Project documentation
│   ├── README.md
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── CONTRIBUTING.md
├── scripts/                  # Build/deployment scripts
│   ├── build.sh
│   ├── deploy.sh
│   └── setup.sh
├── docker-compose.yml        # Docker configuration
├── .gitignore
└── README.md
```

## Database Structure (MongoDB)
```
Collections:
├── users
│   ├── _id
│   ├── name
│   ├── email
│   ├── password (hashed)
│   ├── role (user/admin)
│   ├── profile
│   └── timestamps
├── products
│   ├── _id
│   ├── name
│   ├── description
│   ├── price
│   ├── category
│   ├── images[]
│   ├── stock
│   ├── sizes[]
│   └── timestamps
├── categories
│   ├── _id
│   ├── name
│   ├── description
│   └── image
├── carts
│   ├── _id
│   ├── userId
│   ├── items[]
│   │   ├── productId
│   │   ├── quantity
│   │   └── size
│   └── timestamps
└── orders
    ├── _id
    ├── userId
    ├── items[]
    ├── totalAmount
    ├── status
    ├── shippingAddress
    ├── paymentMethod
    └── timestamps
```

## Key Features Structure
```
Features:
├── Authentication
│   ├── Login/Register
│   ├── JWT Token Management
│   └── Password Reset
├── Product Management
│   ├── Product Catalog
│   ├── Product Details
│   ├── Search & Filter
│   └── Admin CRUD
├── Shopping Cart
│   ├── Add/Remove Items
│   ├── Update Quantities
│   └── Persistent Cart
├── Order Management
│   ├── Checkout Process
│   ├── Payment Integration
│   ├── Order Tracking
│   └── Order History
└── Admin Panel
    ├── Dashboard
    ├── Product Management
    ├── Order Management
    └── User Management
``` 